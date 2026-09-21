import { Component } from '@angular/core';

import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL } from '@core/constants/navigation.constants';

import { ContactFormSection } from './components/contact-form-section/contact-form-section';

/** Contáctanos page: the form and the two direct channels. */
@Component({
	selector: 'app-contact',
	imports: [ContactFormSection],
	templateUrl: './contact.html'
})
export class Contact {
	/** Address for whoever prefers writing from their own mail client. */
	protected readonly email = CONTACT_EMAIL;

	/** WhatsApp number, as it is read out loud. */
	protected readonly whatsapp = CONTACT_WHATSAPP;

	/** Link that opens a chat with that number. */
	protected readonly whatsappUrl = CONTACT_WHATSAPP_URL;
}
