import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LegalDocumentContent } from '@core/interfaces/legal.interface';

/**
 * Renders a full legal document: header with its `h1`, intro, numbered sections and
 * signature. Shared by the pages of the legal domain, which only pick the content.
 */
@Component({
	selector: 'app-legal-article',
	imports: [RouterLink],
	templateUrl: './legal-article.html'
})
export class LegalArticle {
	/** Content of the document to render. */
	readonly content = input.required<LegalDocumentContent>();
}
