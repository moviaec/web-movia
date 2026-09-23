import { AREA_SERVED, SITE_LANG } from '@core/constants/site.constants';

/**
 * Path of the public plans catalogue, hanging from `environment.apiUrl`.
 *
 * The plans themselves —name, price, description, benefits, which one is popular—
 * are NOT here any more: they come from `api-movia`, which is where the back-office
 * edits them. Only the copy that is not a property of a plan stays in this file.
 */
export const PUBLIC_PLANS_PATH = '/plans/public';

/**
 * Country whose catalogue the page shows, as an ISO 3166-1 alpha-2 code.
 *
 * It is the country the site serves, so it is the same value as `AREA_SERVED`. The
 * API also takes a country id, but that UUID changes between the development and the
 * production database; the ISO code does not.
 */
export const PLANS_COUNTRY_CODE = AREA_SERVED;

/** Locale the prices are formatted with: `es-EC` prints `$39,99`. */
export const PLANS_PRICE_LOCALE = SITE_LANG;

/** What an individual plan's price is per. The API bills every plan monthly. */
export const PLAN_PERIOD = '/mes';

/** What the corporate plan's price is per. */
export const CORPORATE_PLAN_PERIOD = '/mes por colaborador';

/** Price printed for a free plan, instead of «$0,00». */
export const PLAN_FREE_PRICE = 'Gratis';

/** Label of the pill that marks the highlighted plan when it has no message of its own. */
export const PLANS_FEATURED_BADGE = 'Plan popular';

/** Label of the pill that marks the corporate plan as what it is. */
export const PLANS_CORPORATE_BADGE = 'Para empresas';

/** How many placeholder cards are painted while the plans load. */
export const PLANS_SKELETON_COUNT = 3;

/** The small print under the cards, one string per paragraph. */
export const PLANS_LEGAL_NOTE: readonly string[] = [
	'*Todos los precios incluyen IVA. En nuestros centros colaboradores, puedes hacer check-in a diario hasta agotar los check-ins de tu plan en el mes natural; no se permiten múltiples check-ins en el mismo centro el mismo día.',
	'Tu suscripción anual se convertirá automáticamente en una suscripción mensual una vez finalizada.'
];
