import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '@core/constants/navigation.constants';
import { SOCIAL_PROFILE_URLS } from '@core/constants/external-links.constants';
import { CORPORATE_PLAN, PLANS } from '@core/constants/plans.constants';
import { AREA_SERVED, DEFAULT_OG_IMAGE, LEGAL_NAME, SITE_LANG, SITE_LOGO, SITE_NAME } from '@core/constants/site.constants';
import { Plan } from '@core/interfaces/plan.interface';
import { JsonLdNode } from '@core/types/json-ld.type';

import { environment } from '../../../environments/environment';

/**
 * The structured data of the site, in the form Google reads it.
 *
 * It is built here, from the SAME constants that paint the screens, and written into
 * the head by `SeoService`. Nothing is typed by hand into a template: a price written
 * twice is a price that one day says 39,99 on the page and 34,99 in the markup, and
 * Google penalises exactly that.
 *
 * `FAQPage` is deliberately NOT here. Since August 2023 Google only shows that rich
 * result to health and government sites, so for this domain the markup would be valid
 * and paint nothing — and it carries the risk of a manual action if the questions ever
 * stop matching what the page shows.
 */

/** Phone in the international format schema.org expects: no spaces and no separators. */
const TELEPHONE = `+${CONTACT_WHATSAPP.replace(/\D/g, '')}`;

/**
 * Composes an absolute URL from the public base.
 *
 * @param path Path from the site root.
 * @returns The absolute URL.
 */
function absolute(path: string): string {
	return path === '/' ? environment.siteUrl : `${environment.siteUrl}${path}`;
}

/**
 * Turns the price as it is PRINTED into the number schema.org expects.
 *
 * The page writes `$39,99`, with the comma of the Spanish decimal; JSON-LD wants
 * `39.99`. Deriving it is the whole point: the two numbers cannot drift because there
 * is only one.
 *
 * @param price Price exactly as the card shows it.
 * @returns The same amount, as a decimal string.
 */
function toAmount(price: string): string {
	return price.replace(/[^\d,.]/g, '').replace(',', '.');
}

/**
 * One `Offer` per plan.
 *
 * @param plan Plan as the page paints it.
 * @returns The offer node.
 */
function toOffer(plan: Plan): JsonLdNode {
	return {
		'@type': 'Offer',
		name: plan.name,
		description: plan.description,
		price: toAmount(plan.price),
		priceCurrency: 'USD',
		availability: 'https://schema.org/InStock',
		url: absolute('/plans')
	};
}

/**
 * The brand: who is behind the site, and how to reach them.
 *
 * `sameAs` is left OUT while there are no social profiles (see
 * `external-links.constants.ts`): it is the property that ties this domain to those
 * accounts, and declaring it empty says nothing.
 */
export const ORGANIZATION_SCHEMA: JsonLdNode = {
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: SITE_NAME,
	legalName: LEGAL_NAME,
	url: absolute('/'),
	logo: absolute(SITE_LOGO),
	image: absolute(DEFAULT_OG_IMAGE),
	areaServed: AREA_SERVED,
	contactPoint: {
		'@type': 'ContactPoint',
		contactType: 'customer support',
		email: CONTACT_EMAIL,
		telephone: TELEPHONE,
		areaServed: AREA_SERVED,
		availableLanguage: 'es'
	},
	...(SOCIAL_PROFILE_URLS.length ? { sameAs: SOCIAL_PROFILE_URLS } : {})
};

/**
 * The site itself.
 *
 * WITHOUT `potentialAction`/`SearchAction`: there is no search inside the site, and
 * declaring one would be telling Google something that is not true.
 */
export const WEBSITE_SCHEMA: JsonLdNode = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: SITE_NAME,
	url: absolute('/'),
	inLanguage: SITE_LANG,
	publisher: { '@type': 'Organization', name: SITE_NAME, url: absolute('/') }
};

/**
 * The membership as a product, with one offer per plan.
 *
 * The four offers are the three individual plans plus the corporate one, in the same
 * order and with the same prices the page prints, because they come from the same
 * `PLANS` and `CORPORATE_PLAN`.
 */
export const PLANS_PRODUCT_SCHEMA: JsonLdNode = {
	'@context': 'https://schema.org',
	'@type': 'Product',
	name: `Membresía ${SITE_NAME}`,
	description: 'Una suscripción mensual que da acceso a la red de gimnasios, estudios y centros de bienestar aliados de Movía en el Ecuador.',
	brand: { '@type': 'Brand', name: SITE_NAME },
	url: absolute('/plans'),
	image: absolute(DEFAULT_OG_IMAGE),
	offers: [...PLANS, CORPORATE_PLAN].map(toOffer)
};
