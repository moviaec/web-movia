import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CONTACT_EMAIL, FOOTER_LEGAL_NAV, FOOTER_NAV } from '@core/constants/navigation.constants';

/** Site footer: brand, store badges, contact, social networks and the link rows. */
@Component({
	selector: 'app-footer',
	imports: [RouterLink],
	templateUrl: './footer.html'
})
export class Footer {
	/** Links to the three pages of the site. */
	protected readonly navLinks = FOOTER_NAV;

	/** Legal links, still without a page behind them. */
	protected readonly legalLinks = FOOTER_LEGAL_NAV;

	/** Address shown next to the social networks. */
	protected readonly email = CONTACT_EMAIL;

	/** Year of the copyright line. */
	protected readonly year = new Date().getFullYear();
}
