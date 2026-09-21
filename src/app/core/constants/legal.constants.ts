import { LegalDocument } from '@core/interfaces/legal.interface';

/**
 * The three legal documents, in the order they are listed on `/legal`.
 *
 * The `summary` says what each document ANSWERS; it is navigation copy, not legal
 * text, and it does not replace the document. El texto de los tres sigue PENDIENTE
 * —hoy las tres páginas solo tienen su `<h1>`— y por eso están en `noindex` en
 * `core/constants/seo.constants.ts`. Cuando exista el contenido se quita el
 * `noindex` allí y entran solas en el sitemap.
 *
 * The paths are written here and in `FOOTER_LEGAL_NAV` because the two lists are
 * different things —a row of links in the footer, a readable index here— but they
 * point at the same routes; if one of them ever moves, both have to move.
 */
export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
	{
		id: 'terms',
		title: 'Términos y condiciones',
		summary: 'Las reglas del servicio: qué incluye cada plan, cómo se cobra la suscripción y qué ocurre cuando la cancelas.',
		path: '/legal/terms'
	},
	{
		id: 'privacy',
		title: 'Políticas de privacidad',
		summary: 'Qué datos personales tratamos, para qué los usamos, cuánto tiempo los conservamos y cómo ejercer tus derechos.',
		path: '/legal/privacy'
	},
	{
		id: 'data-usage',
		title: 'Política de uso de datos',
		summary: 'Qué hacemos con la información que dejas en el formulario de contacto y con la que se genera dentro de la aplicación.',
		path: '/legal/data-usage'
	}
];

/** Lead paragraph of the `/legal` index, under its `h1`. */
export const LEGAL_INTRO = 'Estos son los documentos que rigen el uso de Movía, tanto de la aplicación como de este sitio.';
