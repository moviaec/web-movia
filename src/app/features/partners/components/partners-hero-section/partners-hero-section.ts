import { Component } from '@angular/core';

import { PARTNER_PORTAL_URL } from '@core/constants/partner-portal.constants';

/** Opening of the partners page: the claim over the photo of the studio. */
@Component({
	selector: 'app-partners-hero-section',
	templateUrl: './partners-hero-section.html'
})
export class PartnersHeroSection {
	/** Root of the partner portal, where the call to action goes. */
	protected readonly portalUrl = PARTNER_PORTAL_URL;
}
