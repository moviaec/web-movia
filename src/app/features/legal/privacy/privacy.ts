import { Component } from '@angular/core';

import { PRIVACY_POLICY } from '@core/constants/legal.constants';

import { LegalArticle } from '@features/legal/components/legal-article/legal-article';

/** Políticas de privacidad page. */
@Component({
	selector: 'app-privacy',
	imports: [LegalArticle],
	templateUrl: './privacy.html'
})
export class Privacy {
	/** Text of the document. */
	protected readonly content = PRIVACY_POLICY;
}
