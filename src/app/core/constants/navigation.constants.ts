import { NavLink, PendingLink } from '@core/interfaces/navigation.interface';

/**
 * Main navigation of the header. The labels are the ones written in the design and
 * do NOT match the route they open: «Partners» is the studios page and «Empresa»
 * the companies one.
 */
export const HEADER_NAV: readonly NavLink[] = [
	{ label: 'Partners', path: '/estudios' },
	{ label: 'Empresa', path: '/empresas' },
	{ label: 'Para ti', path: '/planes' }
];

/**
 * Navigation of the footer. Same three pages as the header in a different order,
 * and with «Empresas» in plural where the header says «Empresa».
 */
export const FOOTER_NAV: readonly NavLink[] = [
	{ label: 'Para ti', path: '/planes' },
	{ label: 'Partners', path: '/estudios' },
	{ label: 'Empresas', path: '/empresas' }
];

/**
 * Legal links of the footer. They have no route yet: the three pages exist neither
 * in the design nor in the routing, so they stay as placeholders.
 */
export const FOOTER_LEGAL_NAV: readonly PendingLink[] = [
	{ label: 'Términos & Condiciones' },
	{ label: 'Políticas de Privacidad' },
	{ label: 'Preguntas' }
];

/** Contact address shown in the footer. */
export const CONTACT_EMAIL = 'info@movia.com';
