import { Component } from '@angular/core';

import { BENEFITS } from '@core/constants/home.constants';

/** The three reasons to subscribe, on the dark band of the page. */
@Component({
	selector: 'app-home-benefits-section',
	templateUrl: './home-benefits-section.html'
})
export class HomeBenefitsSection {
	/** Reasons, in the order of the design. */
	protected readonly benefits = BENEFITS;
}
