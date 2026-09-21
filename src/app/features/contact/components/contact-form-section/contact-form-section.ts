import { Component, computed, inject, signal } from '@angular/core';
import { FormField, FormRoot, email, form, maxLength, minLength, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

import {
	CONTACT_AUDIENCES,
	CONTACT_COMPANY_MAX_LENGTH,
	CONTACT_EMAIL_MAX_LENGTH,
	CONTACT_EMAIL_PLACEHOLDER,
	CONTACT_MESSAGE_MAX_LENGTH,
	CONTACT_MESSAGE_MIN_LENGTH,
	CONTACT_MESSAGE_PLACEHOLDER,
	CONTACT_NAME_MAX_LENGTH,
	CONTACT_NAME_PLACEHOLDER,
	CONTACT_PHONE_MAX_LENGTH,
	CONTACT_PHONE_PLACEHOLDER
} from '@core/constants/contact.constants';
import { CONTACT_EMAIL, DATA_USAGE_LINK } from '@core/constants/navigation.constants';
import { ContactAudienceOption, ContactForm, ContactRequest } from '@core/interfaces/contact.interface';
import { ContactService } from '@core/services/contact.service';
import { Toast } from '@shared/components/toast/toast';
import { SubmitStatus } from '@core/types/form.type';

/** Audience selected when the page opens: the one most people writing are. */
const DEFAULT_AUDIENCE = CONTACT_AUDIENCES[0];

/**
 * The contact form, with the audience picked before writing.
 *
 * The audience is the first field and not a dropdown at the bottom for a reason:
 * it decides which team answers and whether the company name is asked at all, so
 * the rest of the form depends on it.
 */
@Component({
	selector: 'app-contact-form-section',
	imports: [FormField, FormRoot, RouterLink, Toast],
	templateUrl: './contact-form-section.html'
})
export class ContactFormSection {
	private readonly _contactService = inject(ContactService);

	/** Audiences to choose from, in the order of the content. */
	protected readonly audiences = CONTACT_AUDIENCES;

	/** Limit shown in the counter under the message box. */
	protected readonly messageMaxLength = CONTACT_MESSAGE_MAX_LENGTH;

	/** Address offered as a way out when the send fails, the same one in the footer. */
	protected readonly contactEmail = CONTACT_EMAIL;

	/** Policy the notice under the send button points at. */
	protected readonly dataUsageLink = DATA_USAGE_LINK;

	/** Examples shown inside the empty fields. The company one lives in its audience. */
	protected readonly placeholders = {
		fullName: CONTACT_NAME_PLACEHOLDER,
		email: CONTACT_EMAIL_PLACEHOLDER,
		phone: CONTACT_PHONE_PLACEHOLDER,
		message: CONTACT_MESSAGE_PLACEHOLDER
	};

	private readonly _model = signal<ContactForm>({
		audience: DEFAULT_AUDIENCE.value,
		fullName: '',
		email: '',
		phone: '',
		company: '',
		message: ''
	});

	/**
	 * Field tree of the form.
	 *
	 * The messages are in Spanish because they end up printed under the input;
	 * they say the same as the ones `api-movia` validates, so nobody gets past
	 * this screen only to be rejected by the API.
	 */
	protected readonly contactForm = form(this._model, (path) => {
		required(path.fullName, { message: 'Dinos cómo te llamas' });
		maxLength(path.fullName, CONTACT_NAME_MAX_LENGTH, { message: `El nombre no puede pasar de ${CONTACT_NAME_MAX_LENGTH} caracteres` });

		required(path.email, { message: 'Necesitamos un correo para responderte' });
		email(path.email, { message: 'Ese correo no parece válido' });
		maxLength(path.email, CONTACT_EMAIL_MAX_LENGTH, { message: 'Ese correo no parece válido' });

		maxLength(path.phone, CONTACT_PHONE_MAX_LENGTH, { message: `El teléfono no puede pasar de ${CONTACT_PHONE_MAX_LENGTH} caracteres` });

		// Solo se exige a quien representa a alguien: quien escribe como usuario
		// no tiene empresa que dar, y el campo ni siquiera se le enseña.
		required(path.company, {
			when: ({ valueOf }) => valueOf(path.audience) !== 'user',
			message: 'Dinos a quién representas'
		});
		maxLength(path.company, CONTACT_COMPANY_MAX_LENGTH, { message: `No puede pasar de ${CONTACT_COMPANY_MAX_LENGTH} caracteres` });

		required(path.message, { message: 'Cuéntanos en qué podemos ayudarte' });
		minLength(path.message, CONTACT_MESSAGE_MIN_LENGTH, { message: 'Cuéntanos un poco más' });
		maxLength(path.message, CONTACT_MESSAGE_MAX_LENGTH, { message: `El mensaje no puede pasar de ${CONTACT_MESSAGE_MAX_LENGTH} caracteres` });
	});

	/** State of the send, which drives the button and the inline feedback. */
	protected readonly status = signal<SubmitStatus>('idle');

	/** Request number the API gives back, shown once the message is through. */
	protected readonly reference = signal('');

	/** The selected audience, with its labels: what the company field reads from. */
	protected readonly selectedAudience = computed<ContactAudienceOption>(() => {
		const value = this.contactForm.audience().value();

		return this.audiences.find((audience) => audience.value === value) ?? DEFAULT_AUDIENCE;
	});

	/** Characters left in the message box. */
	protected readonly messageLeft = computed(() => this.messageMaxLength - this.contactForm.message().value().length);

	/**
	 * Closes the toast: on its own after five seconds, or by hand.
	 *
	 * Going back to `idle` and not to a third state, because that is exactly what is
	 * true once the notice is gone — a form sitting there, ready to be sent again.
	 */
	protected dismissToast(): void {
		this.status.set('idle');
	}

	/**
	 * Sends the form, or lights up the fields that are missing.
	 *
	 * `submit()` is what marks every field as touched and runs the action only
	 * when the form is valid; `onInvalid` brings the button back so it does not
	 * stay spinning on a form that never left.
	 */
	protected async onSubmit(): Promise<void> {
		if (this.status() === 'sending') return;

		this.status.set('sending');

		await submit(this.contactForm, {
			action: () => this._send(),
			onInvalid: () => this.status.set('idle')
		});
	}

	/**
	 * Posts the message and turns the result into what the person reads.
	 *
	 * The catch does not tell apart a 400 from the API, a 429 or the network
	 * being down on purpose: any of the three means the message did not get
	 * through, and the screen says exactly that instead of guessing a cause.
	 */
	private async _send(): Promise<void> {
		try {
			const result = await this._contactService.send(this._payload());

			this.reference.set(result.reference);
			this.status.set('success');
		} catch {
			this.status.set('error');
		}
	}

	/**
	 * Builds what travels to the API out of what is on screen.
	 *
	 * The optional fields go only if they carry something: an empty string in
	 * `phone` would be stored as an empty phone number, which is worse than not
	 * having one because it looks like a real value.
	 */
	private _payload(): ContactRequest {
		const value = this.contactForm().value();
		const company = this.selectedAudience().needsCompany ? value.company.trim() : '';
		const phone = value.phone.trim();

		return {
			audience: value.audience,
			fullName: value.fullName.trim(),
			email: value.email.trim(),
			message: value.message.trim(),
			...(phone ? { phone } : {}),
			...(company ? { company } : {})
		};
	}
}
