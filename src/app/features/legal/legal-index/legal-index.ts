import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LEGAL_DOCUMENTS, LEGAL_INTRO } from '@core/constants/legal.constants';

/**
 * Index of the legal domain: the page `/legal` resolves to.
 *
 * It exists because that URL was being emitted anyway. The prerender writes
 * `legal/index.html` whether or not a route claims the empty path, so before this
 * page there was an indexable file with an empty `<main>` and the default title —
 * textbook thin content. Now it is what it should have been: a readable index that
 * says what each document is and links to the three.
 */
@Component({
	selector: 'app-legal-index',
	imports: [RouterLink],
	templateUrl: './legal-index.html'
})
export class LegalIndex {
	/** The three documents, in the order they are listed. */
	protected readonly documents = LEGAL_DOCUMENTS;

	/** Lead paragraph under the title. */
	protected readonly intro = LEGAL_INTRO;
}
