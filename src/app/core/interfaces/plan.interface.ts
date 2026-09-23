import { PlanAudience } from '@core/types/plan.type';

/**
 * A venue included in a plan, as `GET /plans/public` returns it.
 *
 * The landing does not paint it today; it is typed so the contract with the API
 * is written down whole, and not only the part a template happens to read.
 */
export interface PublicPlanVenue {
	venueId: string;
	name: string;
	/** Check-ins a month at this venue. */
	venueMonthlyCheckins: number;
	/** Check-ins a day at this venue; `null` means the plan's own limit applies. */
	venueDailyCheckins: number | null;
}

/** The plan another one turns into when it renews, trimmed to what announcing it needs. */
export interface PlanRenewal {
	id: string;
	name: string;
	/** Monthly price of that plan, in the minor unit of the currency. */
	priceAmount: number;
}

/**
 * One plan of the public catalogue, exactly as `GET /plans/public` returns it.
 *
 * Money travels as an integer in the MINOR unit of the currency, next to its code
 * and its number of decimals: formatting it is the client's job, and it is done
 * by `formatMinorUnits` in `core/utils/money.utils.ts`.
 */
export interface PublicPlan {
	id: string;
	name: string;
	/** Who the plan is for, in one sentence; `null` while nobody has written one. */
	description: string | null;
	audience: PlanAudience;
	isFree: boolean;
	/** Monthly price in the minor unit of the currency (`3999` is $39,99). */
	priceAmount: number;
	/** ISO 4217 code of the currency (`USD`). */
	currencyCode: string;
	/** Decimals of the currency: USD has two, COP none. */
	currencyExponent: number;
	monthlyCheckins: number;
	dailyCheckins: number;
	/** What the plan promises, one line each and in the order they are painted. */
	benefits: readonly string[];
	/** Whether this is the highlighted plan: lime card and «Plan popular» badge. */
	isPopular: boolean;
	/** Short message for the card's badge («Único por primera vez»); `null` without one. */
	highlightText: string | null;
	venues: readonly PublicPlanVenue[];
	/** Plan this one turns into when the month ends; `null` when it renews as itself. */
	renewsTo: PlanRenewal | null;
}

/** A plan ready to be painted: the API data with the money already formatted. */
export interface PlanCard {
	id: string;
	name: string;
	/** Price as it is printed, currency included («$39,99», «Gratis»). */
	price: string;
	/** What the price is per, printed small next to it. */
	period: string;
	description: string | null;
	benefits: readonly string[];
	/** Whether this is the highlighted plan: lime card. */
	featured: boolean;
	/** Text of the pill over the card, or `null` for none. */
	badge: string | null;
	/** What the plan turns into when the month ends («Después, Standard por $59,99/mes»), or `null`. */
	renewalNote: string | null;
}

/** The two lists the plans page paints, fetched together so the page has one loading state. */
export interface PlansCatalogue {
	/** Individual plans (`b2c`), in the order of the catalogue. */
	individual: PublicPlan[];
	/** Corporate plans (`empresa`), painted in their own block. */
	corporate: PublicPlan[];
}
