import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { PARTNER_SOLUTION_STEPS } from '@core/constants/partners.constants';

/** How Movía fills the empty spots, told in four lines next to the photos. */
@Component({
	selector: 'app-partners-solution-section',
	imports: [NgOptimizedImage],
	templateUrl: './partners-solution-section.html'
})
export class PartnersSolutionSection {
	/** The four lines, in the order they happen. */
	protected readonly steps = PARTNER_SOLUTION_STEPS;
}
