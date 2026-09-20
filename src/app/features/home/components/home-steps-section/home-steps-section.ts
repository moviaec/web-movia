import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { HOW_TO_STEPS } from '@core/constants/home.constants';

/** The four steps that explain how Movía works, next to the app mockups. */
@Component({
	selector: 'app-home-steps-section',
	imports: [NgOptimizedImage],
	templateUrl: './home-steps-section.html'
})
export class HomeStepsSection {
	/** Steps, in the order they happen. */
	protected readonly steps = HOW_TO_STEPS;
}
