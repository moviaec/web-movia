import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '@core/constants/navigation.constants';
import { SOCIAL_PROFILE_URLS } from '@core/constants/external-links.constants';
import { AREA_SERVED, DEFAULT_OG_IMAGE, LEGAL_NAME, SITE_LANG, SITE_LOGO, SITE_NAME } from '@core/constants/site.constants';
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
 * The `Product` of `/plans` is NOT here: its prices come from the API, so it is built
 * from that same response by `buildPlansProductSchema` (`core/utils/structured-data.utils.ts`).
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
