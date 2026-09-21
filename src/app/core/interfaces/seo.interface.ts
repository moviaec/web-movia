import { JsonLdNode } from '@core/types/json-ld.type';

/**
 * Metadata of one route, as it has to end up baked into its prerendered HTML.
 *
 * Every field is copy or a decision about the route, never a composed value: the
 * absolute URLs (canonical, `og:url`, `og:image`) are built by `SeoService` from
 * `environment.siteUrl`, so a change of domain does not touch this file.
 */
export interface RouteSeo {
	/** `<title>` of the page, brand included. Around 60 characters, which is what Google shows. */
	title: string;
	/** `<meta name="description">`. Between 140 and 160 characters, written as an argument and not as a summary. */
	description: string;
	/**
	 * Whether the route may be indexed.
	 *
	 * `false` adds `<meta name="robots" content="noindex">` AND keeps the route out of
	 * the sitemap: the generator of `scripts/generate-seo-files.mjs` reads that tag from
	 * the built HTML, so the decision is taken here once and nowhere else.
	 */
	indexable: boolean;
	/**
	 * Social image of this route, as a path from the site root, when it has one of its own.
	 *
	 * Left out, the route falls back to `DEFAULT_OG_IMAGE`. A route that gets its own
	 * card —prices on `/plans`, the offer on `/partners`— only has to add these two
	 * fields; nothing else changes.
	 */
	image?: string;
	/** `og:image:alt` of that image. Mandatory in practice when `image` is set. */
	imageAlt?: string;
	/**
	 * Structured data of this route, one entry per `<script type="application/ld+json">`.
	 *
	 * Los bloques se construyen en `core/constants/structured-data.constants.ts` a partir
	 * de las MISMAS constantes que pintan la pantalla; aquí solo se dice qué ruta lleva
	 * cuál. Una ruta sin datos estructurados no declara nada, que es lo correcto: un
	 * bloque genérico repetido en las diez páginas no aporta ninguna señal.
	 */
	structuredData?: readonly JsonLdNode[];
}
