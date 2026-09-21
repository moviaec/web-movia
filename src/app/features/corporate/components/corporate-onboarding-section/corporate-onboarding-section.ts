import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheckCircle } from '@ng-icons/heroicons/outline';

import { CORPORATE_ONBOARDING_STEPS } from '@core/constants/corporate.constants';

/** «¿Cómo empezar?»: the four things a company has to do, each with its lime tick. */
@Component({
	selector: 'app-corporate-onboarding-section',
	imports: [NgIcon],
	viewProviders: [provideIcons({ heroCheckCircle })],
	templateUrl: './corporate-onboarding-section.html'
})
export class CorporateOnboardingSection {
	/** Steps, in the order they happen. */
	protected readonly steps = CORPORATE_ONBOARDING_STEPS;
}
