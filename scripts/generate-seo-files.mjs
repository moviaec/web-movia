/**
 * Genera `robots.txt` y `sitemap.xml` DENTRO del dist, después de `ng build`.
 *
 * Por qué generados y no dos archivos a mano en `public/`: el sitemap tiene que
 * decir exactamente qué rutas existen, y eso solo lo sabe el router. Dos archivos
 * escritos a mano son dos verdades que se separan la primera vez que alguien añade
 * una página y se olvida del sitemap — que es siempre.
 *
 * Las dos fuentes son las únicas que ya tienen esa información:
 *
 * - `dist/web-movia/prerendered-routes.json`, que lo escribe el propio prerender a
 *   partir del router: si mañana aparece una ruta, aparece aquí sola.
 * - `src/environments/environment.prod.ts`, de donde sale la base pública. La URL
 *   absoluta NO se escribe en este archivo: un dominio en dos sitios es un dominio
 *   que un día no coincide.
 *
 * Y una tercera comprobación, sobre el HTML ya construido: una ruta cuyo
 * `index.html` lleve `noindex` NO entra en el sitemap. Así la decisión de qué se
 * indexa se toma una sola vez, en `core/constants/seo.constants.ts`, y este script
 * no tiene que saber nada de negocio.
 *
 * Node puro, sin dependencias.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** Carpeta de salida del build, tal como la deja `angular.json`. */
const DIST_DIR = 'dist/web-movia';

/** Carpeta que se publica: es la que sirve el hosting, y donde tienen que caer los dos archivos. */
const BROWSER_DIR = join(DIST_DIR, 'browser');

/** Índice de rutas que escribe el prerender. */
const ROUTES_FILE = join(DIST_DIR, 'prerendered-routes.json');

/** Environment de producción, única fuente de la base pública del sitio. */
const ENVIRONMENT_FILE = 'src/environments/environment.prod.ts';

/** El cascarón vacío de la SPA. No es una página: se cierra al rastreo. */
const CSR_SHELL = '/index.csr.html';

/**
 * Lee `siteUrl` del environment de producción.
 *
 * Se lee con una expresión regular y no importando el módulo porque es TypeScript y
 * este script corre en Node sin compilar. Si el campo desaparece o cambia de forma,
 * el script FALLA en vez de inventarse un dominio: un sitemap con la URL equivocada
 * es peor que no tenerlo.
 *
 * @returns The public base URL, with no trailing slash.
 */
function readSiteUrl() {
	const source = readFileSync(ENVIRONMENT_FILE, 'utf8');
	const match = source.match(/siteUrl:\s*'([^']+)'/);
	if (!match) throw new Error(`No se pudo leer "siteUrl" de ${ENVIRONMENT_FILE}.`);
	return match[1].replace(/\/+$/, '');
}

/**
 * Las rutas prerenderizadas, ordenadas alfabéticamente.
 *
 * @returns Every route path the router emitted, starting with a slash.
 */
function readRoutes() {
	const { routes } = JSON.parse(readFileSync(ROUTES_FILE, 'utf8'));
	return Object.keys(routes).sort();
}

/**
 * Si el HTML de esa ruta pide no ser indexado.
 *
 * Se mira el archivo construido y no una lista en este script: lo que vale es lo que
 * recibe el bot.
 *
 * @param route Route path, as it appears in `prerendered-routes.json`.
 * @returns True when its HTML carries a `noindex` robots tag.
 */
function isNoindex(route) {
	const file = route === '/' ? join(BROWSER_DIR, 'index.html') : join(BROWSER_DIR, route, 'index.html');
	const html = readFileSync(file, 'utf8');
	return /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);
}

/**
 * Compone la URL absoluta de una ruta, sin barra final.
 *
 * @param siteUrl Public base URL.
 * @param route Route path.
 * @returns The absolute URL, matching the page's own canonical.
 */
function absoluteUrl(siteUrl, route) {
	return route === '/' ? siteUrl : `${siteUrl}${route}`;
}

/**
 * El `sitemap.xml` con las rutas indexables.
 *
 * Sin `lastmod`, `changefreq` ni `priority` a propósito: Google ignora los dos
 * últimos desde hace años, y un `lastmod` con la fecha del build diría que las diez
 * páginas cambiaron hoy cada vez que se despliega, que es exactamente la señal que
 * hace que se deje de mirar.
 *
 * @param siteUrl Public base URL.
 * @param routes Indexable route paths.
 * @returns The XML document.
 */
function buildSitemap(siteUrl, routes) {
	const urls = routes.map((route) => `\t<url>\n\t\t<loc>${absoluteUrl(siteUrl, route)}</loc>\n\t</url>`).join('\n');
	return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * El `robots.txt`.
 *
 * @param siteUrl Public base URL.
 * @returns The file contents.
 */
function buildRobots(siteUrl) {
	return ['User-agent: *', 'Allow: /', `Disallow: ${CSR_SHELL}`, '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');
}

const siteUrl = readSiteUrl();
const routes = readRoutes();
const indexable = routes.filter((route) => !isNoindex(route));
const excluded = routes.filter((route) => isNoindex(route));

writeFileSync(join(BROWSER_DIR, 'sitemap.xml'), buildSitemap(siteUrl, indexable));
writeFileSync(join(BROWSER_DIR, 'robots.txt'), buildRobots(siteUrl));

process.stdout.write(`[seo] sitemap.xml con ${indexable.length} de ${routes.length} rutas (base ${siteUrl}).\n`);
if (excluded.length) process.stdout.write(`[seo] fuera del sitemap por noindex: ${excluded.join(', ')}.\n`);
process.stdout.write(`[seo] robots.txt escrito en ${BROWSER_DIR}.\n`);
