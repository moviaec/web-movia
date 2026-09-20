import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRight, heroArrowUpRight } from '@ng-icons/heroicons/outline';

import { COMPANY_PERKS } from '@core/constants/home.constants';

/** Pitch for the companies that offer Movía to their teams. */
@Component({
	selector: 'app-home-companies-section',
	imports: [NgOptimizedImage, RouterLink, NgIcon],
	viewProviders: [provideIcons({ heroArrowRight, heroArrowUpRight })],
	templateUrl: './home-companies-section.html'
})
export class HomeCompaniesSection {
	/** What a company gets. */
	protected readonly perks = COMPANY_PERKS;
}
