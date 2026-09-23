import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, effect, inject, resource } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';

import {
	CORPORATE_PLAN_PERIOD,
	PLANS_CORPORATE_BADGE,
	PLANS_FEATURED_BADGE,
	PLANS_LEGAL_NOTE,
	PLANS_PRICE_LOCALE,
	PLANS_SKELETON_COUNT,
	PLAN_FREE_PRICE,
	PLAN_PERIOD
} from '@core/constants/plans.constants';
import { PlanCard, PlansCatalogue, PublicPlan } from '@core/interfaces/plan.interface';
import { PlansService } from '@core/services/plans.service';
import { SeoService } from '@core/services/seo.service';
import { formatMinorUnits } from '@core/utils/money.utils';
import { buildPlansProductSchema } from '@core/utils/structured-data.utils';

/**
 * Plans page: the individual subscriptions and, apart, the corporate one, both
 * from the public catalogue of `api-movia`.
 *
 * Es UNA sola sección, así que el marcado vive aquí y no en un componente de sección:
 * extraerlo dejaría esta plantilla con una única etiqueta y un nivel muerto de más
 * (`RULES.md` regla 7: ante la duda, no extraer).
 *
 * **The plans are fetched in the browser only.** The build prerenders this page to
 * a static file, and fetching there would freeze the prices of the day of the build
 * into the HTML —which is exactly what moving them to the API is meant to avoid— and
 * would make the build depend on the API being up. So the prerendered HTML carries
 * the placeholder cards, and the browser swaps them for the real ones. The client
 * starts in the same «not loaded» state the server rendered, so hydration matches.
 */
@Component({
	selector: 'app-plans',
	imports: [NgIcon],
	viewProviders: [provideIcons({ heroCheck })],
	templateUrl: './plans.html'
})
export class Plans {
	private readonly _plansService = inject(PlansService);
	private readonly _seoService = inject(SeoService);
	private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

	/**
	 * The catalogue, both audiences in one request pair so the page has a single
	 * loading state. With `params` undefined the resource stays idle, which is what
	 * keeps it from running while prerendering.
	 */
	protected readonly catalogue = resource<PlansCatalogue, true | undefined>({
		params: () => (this._isBrowser ? true : undefined),
		loader: async () => {
			const [individual, corporate] = await Promise.all([this._plansService.findPublic('b2c'), this._plansService.findPublic('empresa')]);
			return { individual, corporate };
		}
	});

	/**
	 * The free plans, each painted as a full-width row above the paid cards. They are
	 * a different offer —one month, once, then a paid plan— and a card in the same row
	 * as the paid ones would compare them as if they were the same thing.
	 */
	protected readonly freePlans = computed<PlanCard[]>(() => {
		if (!this.catalogue.hasValue()) return [];
		return this.catalogue
			.value()
			.individual.filter((plan) => plan.isFree)
			.map((plan) => this._toCard(plan, PLAN_PERIOD));
	});

	/** The paid individual plans, ready to paint, in the order of the catalogue. */
	protected readonly plans = computed<PlanCard[]>(() => {
		if (!this.catalogue.hasValue()) return [];
		return this.catalogue
			.value()
			.individual.filter((plan) => !plan.isFree)
			.map((plan) => this._toCard(plan, PLAN_PERIOD));
	});

	/** The corporate plans, painted in their own block under the others. */
	protected readonly corporatePlans = computed<PlanCard[]>(() => {
		if (!this.catalogue.hasValue()) return [];
		return this.catalogue.value().corporate.map((plan) => this._toCard(plan, CORPORATE_PLAN_PERIOD));
	});

	/** Placeholder cards painted while the plans load, and in the prerendered HTML. */
	protected readonly skeletons = Array.from({ length: PLANS_SKELETON_COUNT }, (_, index) => index);

	/** Label of the pill that marks the corporate plan. */
	protected readonly corporateBadge = PLANS_CORPORATE_BADGE;

	/** Small print under the cards. */
	protected readonly legalNote = PLANS_LEGAL_NOTE;

	constructor() {
		// Writes the `Product` JSON-LD once the prices are known. It is the head of the
		// document, i.e. the outside world, so this is an `effect` and not a `computed`.
		effect(() => {
			if (!this.catalogue.hasValue()) return;
			const { individual, corporate } = this.catalogue.value();
			this._seoService.addStructuredData(buildPlansProductSchema([...individual, ...corporate]));
		});
	}

	/** Asks the API again after a failed load. */
	protected retry(): void {
		this.catalogue.reload();
	}

	/** Turns a plan of the API into what its card prints. */
	private _toCard(plan: PublicPlan, period: string): PlanCard {
		const renewal = plan.renewsTo;

		return {
			id: plan.id,
			name: plan.name,
			price: plan.isFree ? PLAN_FREE_PRICE : this._formatPrice(plan.priceAmount, plan),
			period: plan.isFree ? '' : period,
			description: plan.description,
			benefits: plan.benefits,
			featured: plan.isPopular,
			badge: plan.highlightText ?? (plan.isPopular ? PLANS_FEATURED_BADGE : null),
			renewalNote: renewal ? `Después, ${renewal.name} por ${this._formatPrice(renewal.priceAmount, plan)}${period}` : null
		};
	}

	/** Formats an amount in the currency of the given plan. */
	private _formatPrice(amount: number, plan: PublicPlan): string {
		return formatMinorUnits(amount, plan.currencyExponent, plan.currencyCode, PLANS_PRICE_LOCALE);
	}
}
