import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowUpRight } from '@ng-icons/heroicons/outline';

import { HERO_CARDS } from '@core/constants/home.constants';

/** Opening of the home page: claim over the photo and the three cards below it. */
@Component({
	selector: 'app-home-hero-section',
	imports: [NgOptimizedImage, RouterLink, NgIcon],
	viewProviders: [provideIcons({ heroArrowUpRight })],
	templateUrl: './home-hero-section.html'
})
export class HomeHeroSection {
	/** The three cards that lead to the other pages. */
	protected readonly cards = HERO_CARDS;
}
