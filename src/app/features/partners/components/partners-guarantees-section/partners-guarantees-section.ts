import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { PARTNER_GUARANTEES } from '@core/constants/partners.constants';

/** «Riesgo Cero. Solo Ganas»: the four reasons why listing a studio costs nothing. */
@Component({
	selector: 'app-partners-guarantees-section',
	imports: [NgOptimizedImage],
	templateUrl: './partners-guarantees-section.html'
})
export class PartnersGuaranteesSection {
	/** Reasons, in the order of the design. */
	protected readonly guarantees = PARTNER_GUARANTEES;
}
