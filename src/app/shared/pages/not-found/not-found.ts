import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HEADER_NAV } from '@core/constants/navigation.constants';

/**
 * Page the wildcard route lands on.
 *
 * It lives in `shared/pages/` and not in `features/`: an error state of the router
 * is not a business domain —it has no data and no model— and it is reached from
 * anywhere in the app (`RULES.md` rule 11).
 *
 * It replaces the `redirectTo: ''` the wildcard had. A redirect to the home turns
 * every mistyped URL into a home page served with a 200, which is the soft 404 that
 * Search Console complains about; and for whoever typed it, it reads as the site
 * having thrown them out. Its `noindex` comes from `FALLBACK_SEO`, which is what
 * `SeoService` applies to any path that is not in the map.
 */
@Component({
	selector: 'app-not-found',
	imports: [RouterLink],
	templateUrl: './not-found.html'
})
export class NotFound {
	/** The same pages as the main navigation, so the way out is the one already known. */
	protected readonly navLinks = HEADER_NAV;
}
