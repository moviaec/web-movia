import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { SeoService } from '@core/services/seo.service';

/**
 * Title strategy of the router, widened to the rest of the metadata.
 *
 * `TitleStrategy.updateTitle()` is what already bakes the titles into the prerendered
 * HTML: the router calls it after EVERY successful navigation, on the client and on the
 * server that prerenders. So it is the hook that was already proven to work, and the
 * description, the canonical and the social tags ride on it instead of on a second
 * mechanism of their own.
 *
 * `buildTitle()` is not used and the routes no longer declare `title`: the title of each
 * route lives with the rest of its metadata in `core/constants/seo.constants.ts`.
 */
@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
	private readonly _seo = inject(SeoService);

	/** Applies the whole head of the route the navigation landed on. */
	override updateTitle(snapshot: RouterStateSnapshot): void {
		this._seo.apply(snapshot.url);
	}
}
