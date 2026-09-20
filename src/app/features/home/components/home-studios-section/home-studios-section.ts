import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroArrowRight, heroCheckCircle } from '@ng-icons/heroicons/outline';

import { STUDIO_PERKS } from '@core/constants/home.constants';

/** Pitch for the studios that join the network. */
@Component({
	selector: 'app-home-studios-section',
	imports: [NgOptimizedImage, RouterLink, NgIcon],
	viewProviders: [provideIcons({ heroArrowRight, heroCheckCircle })],
	templateUrl: './home-studios-section.html'
})
export class HomeStudiosSection {
	/** What a studio gets, one per lime card. */
	protected readonly perks = STUDIO_PERKS;
}
