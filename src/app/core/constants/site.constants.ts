/**
 * Identity of the site: the handful of values that are the SAME on every route.
 *
 * Viven aparte de `seo.constants.ts` —que es el copy de cada ruta— por dos razones. La
 * primera es de lectura: aquí está lo que no cambia nunca y allí lo que se edita. La
 * segunda es que si estuvieran juntos habría un ciclo de imports, porque los datos
 * estructurados necesitan la marca y `seo.constants.ts` necesita los datos
 * estructurados; con ES modules ese ciclo no es un aviso, es un `ReferenceError` en
 * arranque, y saldría en el prerender.
 */

/**
 * Brand name, WITH the accent, everywhere it is written.
 *
 * Es el nombre que va en `og:site_name`, el que cierra cada título y el que declaran
 * los datos estructurados. «Movia» sin tilde es la misma marca escrita mal, y mezclar
 * las dos formas es cómo un buscador acaba tratándolas como dos cosas distintas.
 */
export const SITE_NAME = 'Movía';

/** `og:locale`: Spanish of Ecuador, which is where the product operates. */
export const SITE_LOCALE = 'es_EC';

/** `<html lang>` and `inLanguage` of the structured data. */
export const SITE_LANG = 'es-EC';

/**
 * Registered legal name of the company, the one the footer prints and `Organization`
 * declares.
 *
 * En mayúsculas, que es como suelen estar inscritas las razones sociales en el
 * registro. No es el nombre comercial —ese es `SITE_NAME`, «Movía»—, y se escribe UNA
 * sola vez: el pie lo lee de aquí en vez de teclearlo, porque una razón social en dos
 * sitios acaba siendo dos razones sociales.
 */
export const LEGAL_NAME = 'MOVIAPASS SAS';

/** Country the service operates in, as an ISO 3166 code. */
export const AREA_SERVED = 'EC';

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
 * Path of the brand logo for the structured data, with an absolute URL.
 *
 * Es el CUADRADO de 512 × 512 y no el logo horizontal de la cabecera: ese mide 622 × 84
 * y no llega al mínimo de 112 × 112 que Google exige para el `logo` de `Organization`,
 * así que declararlo era declarar algo que se iba a descartar.
 */
export const SITE_LOGO = '/brand/logo-square.png';
