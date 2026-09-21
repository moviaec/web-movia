import { Component } from '@angular/core';

import { PARTNER_GROWTH_STATS } from '@core/constants/partners.constants';

/** The three figures that answer «¿Cuánto puedes crecer con Movia?». */
@Component({
	selector: 'app-partners-growth-section',
	templateUrl: './partners-growth-section.html'
})
export class PartnersGrowthSection {
	/** Figures, in the order of the design. */
	protected readonly stats = PARTNER_GROWTH_STATS;
}
