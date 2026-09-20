import { Component, signal } from '@angular/core';

import { FAQ_ITEMS } from '@core/constants/home.constants';

/** Frequently asked questions, as an accordion. */
@Component({
	selector: 'app-home-faq-section',
	templateUrl: './home-faq-section.html'
})
export class HomeFaqSection {
	/** Questions, in the order of the design. */
	protected readonly items = FAQ_ITEMS;

	/** Id of the open question, or null when every one is closed, as the design shows them. */
	protected readonly openId = signal<string | null>(null);

	/** Opens the question, or closes it when it was already open. */
	protected toggle(id: string): void {
		this.openId.update((current) => (current === id ? null : id));
	}
}
