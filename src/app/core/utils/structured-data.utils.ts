import { DEFAULT_OG_IMAGE, SITE_NAME } from '@core/constants/site.constants';
import { PublicPlan } from '@core/interfaces/plan.interface';
import { JsonLdNode } from '@core/types/json-ld.type';
import { toDecimalAmount } from '@core/utils/money.utils';

import { environment } from '../../../environments/environment';

/** Absolute URL of the plans page, which is where every offer points. */
const PLANS_URL = `${environment.siteUrl}/plans`;

/**
 * One `Offer` per plan, with the price the card prints.
 *
 * @param plan Plan as the API returns it.
 * @returns The offer node.
 */
function toOffer(plan: PublicPlan): JsonLdNode {
	return {
		'@type': 'Offer',
		name: plan.name,
		...(plan.description ? { description: plan.description } : {}),
		price: toDecimalAmount(plan.priceAmount, plan.currencyExponent),
		priceCurrency: plan.currencyCode,
		availability: 'https://schema.org/InStock',
		url: PLANS_URL
	};
}

/**
 * The membership as a product, with one offer per plan.
 *
 * It is built from the SAME response that paints the cards, so the prices in the
 * markup and on the page cannot drift apart — Google penalises exactly that. Being
 * built from live data, it is written into the head once the plans load, in the
 * browser, and is not in the prerendered HTML: Google reads it after rendering the
 * page.
 *
 * @param plans Every plan the page shows, individual and corporate.
 * @returns The `Product` node.
 */
export function buildPlansProductSchema(plans: readonly PublicPlan[]): JsonLdNode {
	return {
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: `Membresía ${SITE_NAME}`,
		description: 'Una suscripción mensual que da acceso a la red de gimnasios, estudios y centros de bienestar aliados de Movía en el Ecuador.',
		brand: { '@type': 'Brand', name: SITE_NAME },
		url: PLANS_URL,
		image: `${environment.siteUrl}${DEFAULT_OG_IMAGE}`,
		offers: plans.map(toOffer)
	};
}
