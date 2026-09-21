import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { CORPORATE_REASONS } from '@core/constants/corporate.constants';

/** «¿Por qué Movia?»: the four reasons, next to the two overlapping photos. */
@Component({
	selector: 'app-corporate-reasons-section',
	imports: [NgOptimizedImage],
	templateUrl: './corporate-reasons-section.html'
})
export class CorporateReasonsSection {
	/** Reasons, in the order of the design. */
	protected readonly reasons = CORPORATE_REASONS;
}
