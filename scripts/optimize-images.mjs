/**
 * Convierte a WebP las imágenes de `public/imgs/` y las baja al tamaño en que se ven.
 *
 * Se ejecuta a mano (`npm run imgs:optimize`) y NO cuelga del build: el resultado se
 * commitea. Las fotos las entrega diseño de una en una y convertirlas en cada build
 * sería pagar veinte segundos por un trabajo que solo cambia cuando llega una imagen
 * nueva.
 *
 * Las dos operaciones son las que el informe de Lighthouse pedía por ese orden:
 *
 * 1. WebP, que es donde está la mayor parte del ahorro y no cambia ni una plantilla
 *    más allá de la extensión.
 * 2. Redimensionar al DOBLE del ancho mayor al que la imagen llega a verse. El doble,
 *    y no el ancho justo, porque en una pantalla retina un píxel CSS son dos físicos:
 *    servir el ancho exacto se ve borroso. Los anchos de la tabla están MEDIDOS en el
 *    navegador (`getBoundingClientRect`) a 1920 px y a 375 px, quedándose con el mayor
 *    de los dos.
 *
 * Nunca agranda: si el doble del tamaño mostrado supera el original, se queda el
 * original. Una imagen que no está en la tabla se convierte SIN redimensionar, que es
 * el comportamiento seguro para cualquier archivo que llegue después.
 *
 * Los originales NO se borran aquí: eso se hace después de comprobar que ninguna
 * plantilla los referencia.
 */

import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

/** Carpeta de las imágenes del sitio. */
const IMAGES_DIR = 'public/imgs';

/** Lo que se convierte. El SVG se queda como está: ya es vectorial y pesa nada. */
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

/** Calidad WebP por defecto, para fotografías. */
const DEFAULT_QUALITY = 80;

/** Calidad para las marcas (logo, insignias de tienda, redes): planas, con bordes limpios y ya ligeras. */
const BRAND_QUALITY = 90;

/**
 * Ancho MÁXIMO en píxeles CSS al que se llega a ver cada imagen, medido en el navegador.
 *
 * La clave es la ruta del WebP RESULTANTE, no la del original: los originales se borran
 * una vez convertidos, y una tabla que los nombrase quedaría hablando de archivos que ya
 * no existen. Así la fila sigue sirviendo si mañana llega otra versión de esa misma foto.
 *
 * Añadir una imagen nueva es añadir su fila: mídela con `getBoundingClientRect().width`
 * en el ancho de pantalla donde salga más grande (aquí se midió a 1920 px y a 375 px).
 * Sin fila, se convierte a WebP y se queda con su tamaño original, que es lo seguro.
 *
 * OJO con `object-cover`: ahí el ancho mostrado NO basta, porque la imagen se recorta
 * para cubrir la caja y quien manda puede ser el ALTO. Los dos recortes de móvil de los
 * heroes (los `hero-movil` de home y de partners) son el caso: se ven a 375 px de ancho,
 * pero cubriendo una caja mucho más alta que ancha, así que bajarlos a 750 px los dejaba
 * borrosos en una pantalla retina. No llevan fila y se quedan con su tamaño original a
 * propósito. La cuenta con `object-cover` es max(anchoCaja / anchoOriginal, altoCaja /
 * altoOriginal), con la caja ya por 2: si pasa de 1, el original ya se está estirando.
 */
const DISPLAY_WIDTHS = {
	'imgs/corporate/beneficios-colaborador.webp': 534,
	'imgs/corporate/beneficios-empresa.webp': 534,
	'imgs/corporate/hero.webp': 1920,
	'imgs/corporate/modelo.webp': 511,
	/*
	 * `modelo-movil` NO la referencia ninguna plantilla: se convirtió igual para no
	 * perderla, pero hoy no se está viendo en ninguna pantalla. Sin fila, porque no hay
	 * tamaño mostrado que medir.
	 */
	'imgs/corporate/por-que-pequena.webp': 273,
	'imgs/corporate/por-que.webp': 324,
	'imgs/home/app-movia.webp': 418,
	/*
	 * Las cinco fotos de categorías comparten el `width`/`height` de la plantilla, así
	 * que van todas al mismo ancho aunque la del centro se vea algo más grande: dos
	 * tamaños intrínsecos distintos bajo los mismos atributos es lo que hace saltar el
	 * aviso de proporción de `NgOptimizedImage`.
	 */
	'imgs/home/categorias/artes-marciales.webp': 258,
	'imgs/home/categorias/baile.webp': 258,
	'imgs/home/categorias/gimnasio.webp': 258,
	'imgs/home/categorias/natacion.webp': 258,
	'imgs/home/categorias/yoga.webp': 258,
	'imgs/home/cta-persona.webp': 683,
	'imgs/home/empresas.webp': 351,
	'imgs/home/estudios.webp': 351,
	'imgs/home/hero.webp': 1920,
	'imgs/home/mapa.webp': 1920,
	'imgs/layout/app-store.webp': 140,
	'imgs/layout/facebook.webp': 44,
	'imgs/layout/google-play.webp': 141,
	'imgs/layout/instagram.webp': 44,
	'imgs/layout/linkedin.webp': 44,
	/*
	 * PENDIENTE: el logo definitivo es un SVG que aporta el usuario. Este PNG venía a
	 * 4106 px de ancho para verse a 311 y pesaba 68 KB en TODAS las páginas; mientras
	 * llega el vector, va a 622 px como cualquier otra imagen.
	 */
	'imgs/layout/logo-movia.webp': 311,
	'imgs/partners/como-funciona-pequena.webp': 203,
	'imgs/partners/como-funciona.webp': 296,
	'imgs/partners/hero.webp': 1920,
	'imgs/partners/riesgo-cero.webp': 325,
	'imgs/partners/solucion.webp': 231
};

/** Cuántos píxeles físicos por píxel CSS se sirven. Dos: es lo que tiene cualquier móvil actual. */
const PIXEL_RATIO = 2;

/**
 * Every convertible image under the images folder.
 *
 * @param dir Directory to walk.
 * @returns Absolute-ish paths of the source files, relative to the project root.
 */
function findImages(dir) {
	const found = [];
	for (const entry of readdirSync(dir)) {
		const path = join(dir, entry);
		if (statSync(path).isDirectory()) {
			found.push(...findImages(path));
			continue;
		}
		if (SOURCE_EXTENSIONS.includes(extname(entry).toLowerCase())) found.push(path);
	}
	return found.sort();
}

/**
 * Converts one image and reports what it did.
 *
 * @param file Path of the source image.
 * @returns A row of the before/after table.
 */
async function convert(file) {
	const key = relative('public', file);
	const image = sharp(file);
	const { width, height } = await image.metadata();
	const outputKey = key.replace(/\.(jpe?g|png)$/i, '.webp');
	const displayWidth = DISPLAY_WIDTHS[outputKey];
	const targetWidth = displayWidth ? Math.min(displayWidth * PIXEL_RATIO, width) : width;

	const output = file.replace(/\.(jpe?g|png)$/i, '.webp');
	const quality = outputKey.startsWith('imgs/layout/') ? BRAND_QUALITY : DEFAULT_QUALITY;

	// `withoutEnlargement` es el cinturón del `Math.min` de arriba: ninguna imagen se
	// agranda, ni aunque la tabla acabe con un ancho equivocado.
	const info = await image.resize({ width: targetWidth, withoutEnlargement: true }).webp({ quality, effort: 6 }).toFile(output);

	return {
		file: key,
		before: { width, height, bytes: statSync(file).size },
		after: { width: info.width, height: info.height, bytes: info.size }
	};
}

/**
 * Formats a byte count the way the report reads it.
 *
 * @param bytes Size in bytes.
 * @returns The size in KB, with no decimals.
 */
function kb(bytes) {
	return `${Math.round(bytes / 1024)} KB`;
}

const files = findImages(IMAGES_DIR);
const rows = [];
for (const file of files) rows.push(await convert(file));

const totalBefore = rows.reduce((sum, row) => sum + row.before.bytes, 0);
const totalAfter = rows.reduce((sum, row) => sum + row.after.bytes, 0);

const lines = rows.map(
	(row) =>
		`${row.file.padEnd(44)} ${`${row.before.width}x${row.before.height}`.padStart(9)} ${kb(row.before.bytes).padStart(8)}` +
		`  →  ${`${row.after.width}x${row.after.height}`.padStart(9)} ${kb(row.after.bytes).padStart(8)}`
);

process.stdout.write(`${lines.join('\n')}\n`);
process.stdout.write(`${''.padEnd(44)} ${''.padStart(9)} ${kb(totalBefore).padStart(8)}  →  ${''.padStart(9)} ${kb(totalAfter).padStart(8)}\n`);
process.stdout.write(`[imgs] ${rows.length} imágenes convertidas. Los originales NO se borran: compruébalo antes con un grep de las plantillas.\n`);
