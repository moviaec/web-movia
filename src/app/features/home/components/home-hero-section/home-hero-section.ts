import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HERO_CARDS } from '@core/constants/home.constants';

/** Opening of the home page: claim over the photo and the three cards below it. */
@Component({
	selector: 'app-home-hero-section',
	imports: [RouterLink],
	templateUrl: './home-hero-section.html'
})
export class HomeHeroSection {
	/** The three cards that lead to the other pages. */
	protected readonly cards = HERO_CARDS;
}
