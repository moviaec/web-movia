import { Component } from '@angular/core';

import { TERMS_OF_SERVICE } from '@core/constants/legal.constants';

import { LegalArticle } from '@features/legal/components/legal-article/legal-article';

/** Términos y condiciones page. */
@Component({
	selector: 'app-terms',
	imports: [LegalArticle],
	templateUrl: './terms.html'
})
export class Terms {
	/** Text of the document. */
	protected readonly content = TERMS_OF_SERVICE;
}
