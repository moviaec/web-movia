import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Tab, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

import { FaqAccordion } from '@shared/components/faq-accordion/faq-accordion';

import { HELP_GROUPS } from '@core/constants/help.constants';

/** Centro de ayuda page: one tab per audience, each with its own questions. */
@Component({
	selector: 'app-help',
	imports: [RouterLink, FaqAccordion, Tabs, TabList, Tab, TabPanel],
	templateUrl: './help.html'
})
export class Help {
	/** Blocks of the page: users, companies and partners, in that order. */
	protected readonly groups = HELP_GROUPS;

	/**
	 * Tab shown when the page opens.
	 *
	 * It is a two-way model with `ngTabList`, so it also follows the keyboard: the arrow
	 * keys move between tabs and this signal always holds the one being read.
	 */
	protected readonly selectedGroupId = signal<string | undefined>(HELP_GROUPS[0].id);
}
