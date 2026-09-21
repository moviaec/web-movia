import { ContactAudienceOption } from '@core/interfaces/contact.interface';

/**
 * The three audiences of the contact form, in the order they are shown.
 *
 * Same split as the help centre (`HELP_GROUPS`) and the same one the API stores
 * in `contact_requests.audience`: it decides which team answers, so it is picked
 * before writing and not guessed afterwards from the message.
 */
export const CONTACT_AUDIENCES: readonly ContactAudienceOption[] = [
	{
		value: 'user',
		label: 'Entreno con Movia o quiero empezar',
		description: 'Entreno con Movia o quiero empezar.',
		needsCompany: false,
		companyLabel: '',
		companyPlaceholder: ''
	},
	{
		value: 'corporate',
		label: 'Quiero darlo como beneficio a mi equipo.',
		description: 'Quiero darlo como beneficio a mi equipo.',
		needsCompany: true,
		companyLabel: 'Empresa',
		companyPlaceholder: 'Corporación Andes'
	},
	{
		value: 'partner',
		label: 'Tengo un gimnasio o estudio y quiero entrar en la red.',
		description: 'Tengo un gimnasio o estudio y quiero entrar en la red.',
		needsCompany: true,
		companyLabel: 'Nombre del centro',
		companyPlaceholder: 'Estudio Norte'
	}
];

/**
 * Limits of each field, the same ones `api-movia` validates in
 * `CreateContactRequestDto`.
 *
 * They live here so the screen rejects what the API would reject anyway, before
 * a round trip: a 400 coming back with the form already sent reads like a bug.
 *
 * ⚠ They are written twice, once per repository, because there is no shared
 * package between the landing and the API. Changing one means changing the other
 * (`src/common/constants/contact-request.constant.ts` over there).
 */
export const CONTACT_NAME_MAX_LENGTH = 255;
export const CONTACT_EMAIL_MAX_LENGTH = 320;
export const CONTACT_PHONE_MAX_LENGTH = 32;
export const CONTACT_COMPANY_MAX_LENGTH = 255;
export const CONTACT_MESSAGE_MIN_LENGTH = 10;
export const CONTACT_MESSAGE_MAX_LENGTH = 2000;

/**
 * Examples shown inside the fields that are the same for every audience.
 *
 * They are examples and not a repeat of the label: a placeholder saying «Nombre
 * y apellido» under a label saying «Nombre y apellido» is noise, while a written
 * example is what answers the only real doubt of a field, which is with what
 * shape it is expected. The company field has its own per audience, in
 * `CONTACT_AUDIENCES`.
 *
 * ⚠ They are NOT a substitute for the label: a placeholder disappears as soon as
 * someone types, so every field keeps its own `<label>`.
 */
export const CONTACT_NAME_PLACEHOLDER = 'Ana Torres';
export const CONTACT_EMAIL_PLACEHOLDER = 'ana@correo.com';
export const CONTACT_PHONE_PLACEHOLDER = '+593 99 123 4567';
export const CONTACT_MESSAGE_PLACEHOLDER = 'Cuéntanos con detalle qué necesitas y te respondemos.';

/** Path of the endpoint that takes the form, hanging from `environment.apiUrl`. */
export const CONTACT_REQUESTS_PATH = '/contact-requests';
