import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheckCircle } from '@ng-icons/heroicons/outline';

import { CORPORATE_BENEFITS, CORPORATE_QUOTE } from '@core/constants/corporate.constants';

/** «Beneficios que te ofrece Movia»: the two cards that straddle the dark band, and the quote. */
@Component({
	selector: 'app-corporate-benefits-section',
	imports: [NgOptimizedImage, NgIcon],
	viewProviders: [provideIcons({ heroCheckCircle })],
	templateUrl: './corporate-benefits-section.html'
})
export class CorporateBenefitsSection {
	/** The two sides of the deal, each with its photo and its checklist. */
	protected readonly benefits = CORPORATE_BENEFITS;

	/** Quote that closes the dark band. */
	protected readonly quote = CORPORATE_QUOTE;
}
