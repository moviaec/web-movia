import { Component } from '@angular/core';

import { PARTNER_PORTAL_URL } from '@core/constants/partner-portal.constants';

/** Closing call to action, on the lime card that overlaps the dark band above it. */
@Component({
	selector: 'app-partners-cta-section',
	templateUrl: './partners-cta-section.html'
})
export class PartnersCtaSection {
	/** Root of the partner portal, where the call to action goes. */
	protected readonly portalUrl = PARTNER_PORTAL_URL;
}
