import { Component, computed, input, signal } from '@angular/core';

import { FaqItem } from '@core/interfaces/faq.interface';

/**
 * List of questions that open one at a time.
 *
 * The two-column layout is done with two independent lists and NOT with a single grid:
 * in a grid both columns share their rows, so opening one answer stretched the question
 * sitting next to it and left a hole under it.
 */
@Component({
	selector: 'app-faq-accordion',
	templateUrl: './faq-accordion.html'
})
export class FaqAccordion {
	/** Questions to show, in the order they are read. */
	readonly items = input.required<readonly FaqItem[]>();

	/** With true the list splits in two columns from `lg` on, filled top to bottom. */
	readonly twoColumns = input(false);

	/** Prefix of the panel ids, so two accordions on the same page never collide. */
	readonly idPrefix = input('faq');

	/** The questions already split in the columns that are going to be painted. */
	protected readonly columns = computed<readonly (readonly FaqItem[])[]>(() => {
		const items = this.items();
		if (!this.twoColumns()) return [items];
		const half = Math.ceil(items.length / 2);
		return [items.slice(0, half), items.slice(half)];
	});

	/** Id of the open question, or null when every one is closed. */
	private readonly _openId = signal<string | null>(null);

	/** True when that question is the open one. */
	protected isOpen(id: string): boolean {
		return this._openId() === id;
	}

	/** Opens the question, or closes it when it was already open. */
	protected toggle(id: string): void {
		this._openId.update((current) => (current === id ? null : id));
	}
}
