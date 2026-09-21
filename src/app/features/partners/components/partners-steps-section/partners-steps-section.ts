import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { PARTNER_CHECKIN_STEPS } from '@core/constants/partners.constants';

/** «¿Cómo Funciona En Tu Estudio?»: the check-in flow, on the dark band of the page. */
@Component({
	selector: 'app-partners-steps-section',
	imports: [NgOptimizedImage],
	templateUrl: './partners-steps-section.html'
})
export class PartnersStepsSection {
	/** Steps, in the order they happen. */
	protected readonly steps = PARTNER_CHECKIN_STEPS;
}
