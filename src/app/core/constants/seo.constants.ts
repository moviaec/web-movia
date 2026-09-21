import { RouteSeo } from '@core/interfaces/seo.interface';

/**
 * Brand name, WITH the accent, everywhere it is written.
 *
 * It is the name that goes in `og:site_name` and the one that closes every title.
 * «Movia» without the accent is the same brand written wrong, and mixing both is how
 * a search engine ends up treating them as two different things.
 */
export const SITE_NAME = 'Movía';

/** `og:locale`: Spanish of Ecuador, which is where the product operates. */
export const SITE_LOCALE = 'es_EC';

/** `<html lang>` and `inLanguage` of the structured data. */
export const SITE_LANG = 'es-EC';

/**
 * Social image used by every route that does not bring its own.
 *
 * PENDIENTE: el archivo NO existe todavía; lo aporta el usuario. Tiene que ser
 * 1200 × 630 px, JPG y por debajo de 300 KB, que es el peso a partir del cual
 * WhatsApp deja de descargar la vista previa.
 */
export const DEFAULT_OG_IMAGE = '/og/og-default.jpg';

/** `og:image:alt` of that default image. */
export const DEFAULT_OG_IMAGE_ALT = 'Movía · una membresía para gimnasios, estudios y centros de bienestar del Ecuador';

/** Width of a social card, in pixels. The four networks ask for 1200 × 630. */
export const OG_IMAGE_WIDTH = '1200';

/** Height of a social card, in pixels. */
export const OG_IMAGE_HEIGHT = '630';

/**
 * Metadata of every route of the site, keyed by its path with no trailing slash.
 *
 * ESTE ES EL ÚNICO SITIO donde se escribe el copy de los metadatos. Ni los
 * componentes ni el `data` de las rutas llevan nada: el `title` de cada ruta se
 * borró de los `*.routes.ts` a propósito, porque dos sitios donde poner el título
 * son dos títulos que acaban diciendo cosas distintas.
 *
 * Se puede editar el texto de cualquier entrada sin tocar una línea de lógica.
 * Reglas del copy, para que siga cumpliéndose al editarlo:
 *
 * - `title`: hasta unos 60 caracteres (lo que Google enseña) y escrito hacia lo que
 *   alguien teclea, no hacia el nombre interno de la página.
 * - `description`: entre 140 y 160 caracteres, un argumento y no un resumen.
 * - La marca es «Movía», con tilde, en los dos.
 * - Nada de ciudades concretas mientras la red no esté publicada por ciudad.
 */
export const ROUTE_SEO: Readonly<Record<string, RouteSeo>> = {
	'/': {
		title: 'Movía · Gimnasios, yoga y natación con una sola membresía',
		description:
			'Una sola membresía mensual para entrenar en gimnasios, estudios de yoga, natación y bienestar de todo el Ecuador. Eliges el centro y haces check-in con la app.',
		indexable: true
	},
	'/plans': {
		title: 'Planes y precios de Movía desde $39,99 al mes',
		description:
			'Planes de Movía desde $39,99 al mes, de 8 a 28 check-ins en toda la red de centros aliados del Ecuador. Sin permanencia: cambias o cancelas desde la app.',
		indexable: true
	},
	'/partners': {
		title: 'Suma tu gimnasio o estudio a la red de Movía',
		description:
			'Llena las horas flojas de tu centro sin costo de alta ni permanencia: publicas los horarios que quieres y cobras por cada persona que hace check-in contigo.',
		indexable: true
	},
	'/corporate': {
		title: 'Bienestar corporativo para tu equipo · Movía',
		description:
			'Da a tu equipo gimnasios, yoga y natación en todo el Ecuador con una sola factura mensual, altas y bajas cuando quieras y reportes de uso del beneficio.',
		indexable: true
	},
	'/contact': {
		title: 'Contacta con Movía: soporte, empresas y centros',
		description:
			'Escríbenos y te respondemos: dudas de tu membresía, propuestas para tu empresa o el alta de tu centro. Te confirmamos por correo con un número de solicitud.',
		indexable: true
	},
	'/help': {
		title: 'Centro de ayuda de Movía: check-ins, planes y pagos',
		description:
			'Resolvemos lo que más nos preguntan: qué es un check-in, cómo cambiar o cancelar tu plan, cómo se factura a una empresa y cómo se paga a un centro aliado.',
		indexable: true
	},
	'/legal': {
		title: 'Información legal y políticas de Movía',
		description:
			'Términos y condiciones, políticas de privacidad y política de uso de datos de Movía: los documentos que rigen el uso de la aplicación y de este sitio web.',
		indexable: true
	},
	/*
	 * Los tres documentos legales van en `noindex` porque HOY están vacíos: solo
	 * tienen su `<h1>`. Una página indexable sin contenido es el caso de libro de
	 * «contenido escaso», y además el formulario de contacto ya enlaza la política
	 * de uso de datos como consentimiento del envío.
	 *
	 * En cuanto exista el texto de cada uno se pone `indexable: true` y entran solos
	 * en el sitemap: no hay nada más que tocar. Su `description` describe el ALCANCE
	 * del documento, no su contenido, y habrá que repasarla contra el texto real.
	 */
	'/legal/terms': {
		title: 'Términos y condiciones · Movía',
		description:
			'Condiciones de uso de la membresía de Movía: qué incluye cada plan, cómo se cobra, cómo se cancela y qué reglas rigen el acceso a los centros aliados.',
		indexable: false
	},
	'/legal/privacy': {
		title: 'Políticas de privacidad · Movía',
		description:
			'Qué datos personales recoge Movía, para qué los usa, con quién los comparte, cuánto tiempo los guarda y cómo ejercer tus derechos sobre esa información.',
		indexable: false
	},
	'/legal/data-usage': {
		title: 'Política de uso de datos · Movía',
		description:
			'Cómo trata Movía la información que dejas en el formulario de contacto y en la aplicación, para qué la utiliza y durante cuánto tiempo la conserva.',
		indexable: false
	}
};

/**
 * Metadata of anything that is not a known route: the 404 page and, as a safety net,
 * a route added to the router and forgotten here.
 *
 * `noindex` on purpose, and in the two cases for the same reason: a URL that does not
 * name a page of the site has nothing to rank for.
 */
export const FALLBACK_SEO: RouteSeo = {
	title: 'Página no encontrada · Movía',
	description:
		'La página que buscas no existe o cambió de dirección. Vuelve al inicio, mira los planes de Movía o escríbenos si necesitas que te echemos una mano.',
	indexable: false
};
