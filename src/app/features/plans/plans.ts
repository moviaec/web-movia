import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheck } from '@ng-icons/heroicons/outline';

import { CORPORATE_PLAN, PLANS, PLANS_CORPORATE_BADGE, PLANS_FEATURED_BADGE, PLANS_LEGAL_NOTE } from '@core/constants/plans.constants';

/**
 * Plans page: the individual subscriptions and, apart, the corporate one.
 *
 * Es UNA sola sección, así que el marcado vive aquí y no en un componente de sección:
 * extraerlo dejaría esta plantilla con una única etiqueta y un nivel muerto de más
 * (`RULES.md` regla 7: ante la duda, no extraer).
 */
@Component({
	selector: 'app-plans',
	imports: [NgIcon],
	viewProviders: [provideIcons({ heroCheck })],
	templateUrl: './plans.html'
})
export class Plans {
	/** The three individual plans, from the cheapest to the most expensive. */
	protected readonly plans = PLANS;

	/** The corporate plan, shown in its own block under the others. */
	protected readonly corporatePlan = CORPORATE_PLAN;

	/** Label of the pill that marks the highlighted plan. */
	protected readonly featuredBadge = PLANS_FEATURED_BADGE;

	/** Label of the pill that marks the corporate plan. */
	protected readonly corporateBadge = PLANS_CORPORATE_BADGE;

	/** Small print under the cards. */
	protected readonly legalNote = PLANS_LEGAL_NOTE;
}
