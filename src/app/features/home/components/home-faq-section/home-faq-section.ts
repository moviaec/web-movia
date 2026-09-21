import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FaqAccordion } from '@shared/components/faq-accordion/faq-accordion';

import { FAQ_ITEMS } from '@core/constants/home.constants';

/** Frequently asked questions, as an accordion. */
@Component({
	selector: 'app-home-faq-section',
	imports: [RouterLink, FaqAccordion],
	templateUrl: './home-faq-section.html'
})
export class HomeFaqSection {
	/** Questions, in the order of the design. */
	protected readonly items = FAQ_ITEMS;
}
