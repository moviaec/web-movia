import { NavLink } from '@core/interfaces/navigation.interface';

/**
 * Main navigation of the header.
 *
 * Labels are product copy and stay in Spanish; paths are identifiers and go in
 * English (rule 12), so no label matches its own path: «Para partners» opens
 * `/partners` and «Para empresas», `/corporate`. «Contáctanos» is not in the design:
 * it was added so the page is reachable from every screen, not only from the FAQ.
 */
export const HEADER_NAV: readonly NavLink[] = [
	{ label: 'Hazte Partner', path: '/partners' },
	{ label: 'Para Empresas', path: '/corporate' },
	{ label: 'Planes', path: '/plans' },
	{ label: 'Contáctanos', path: '/contact' }
];

/** Navigation of the footer. Same pages as the header in a different order. */
export const FOOTER_NAV: readonly NavLink[] = [
	{ label: 'Hazte Partner', path: '/partners' },
	{ label: 'Para Empresas', path: '/corporate' },
	{ label: 'Planes', path: '/plans' },
	{ label: 'Contáctanos', path: '/contact' }
];

/**
 * Data usage policy.
 *
 * It has a name of its own because it is linked from two places that are not the
 * same list: the footer row below, and the notice under the contact form's send
 * button. Writing the path twice is how the two end up pointing at different
 * pages the day the route changes.
 */
export const DATA_USAGE_LINK: NavLink = { label: 'Política de Uso de Datos', path: '/legal/data-usage' };

/** Legal links of the footer. The help centre has its own button, above them. */
export const FOOTER_LEGAL_NAV: readonly NavLink[] = [
	{ label: 'Términos & Condiciones', path: '/legal/terms' },
	{ label: 'Políticas de Privacidad', path: '/legal/privacy' },
	DATA_USAGE_LINK
];

/** Contact address shown in the footer. */
export const CONTACT_EMAIL = 'soporte@moviapass.com';

/** WhatsApp shown in the footer, formatted the way it is read out loud. */
export const CONTACT_WHATSAPP = '+593 99 548 9085';

/**
 * Link to that same WhatsApp. `wa.me` only accepts the number in international
 * format with no «+», no spaces and no dashes, so it is derived from the one
 * above instead of written twice: two copies of a phone number drift apart.
 */
export const CONTACT_WHATSAPP_URL = `https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, '')}`;
