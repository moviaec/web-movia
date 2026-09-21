import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroEnvelopeSolid } from '@ng-icons/heroicons/solid';

import { EXTERNAL_LINKS } from '@core/constants/external-links.constants';
import { CONTACT_EMAIL, CONTACT_WHATSAPP, CONTACT_WHATSAPP_URL, FOOTER_LEGAL_NAV, FOOTER_NAV } from '@core/constants/navigation.constants';

/** Site footer: brand, store badges, contact, social networks and the link rows. */
@Component({
	selector: 'app-footer',
	imports: [RouterLink, NgIcon],
	viewProviders: [provideIcons({ heroEnvelopeSolid })],
	templateUrl: './footer.html'
})
export class Footer {
	/** Links to the three pages of the site. */
	protected readonly navLinks = FOOTER_NAV;

	/** Store and social links. They are `#` until the real URLs exist. */
	protected readonly externalLinks = EXTERNAL_LINKS;

	/** Legal links, still without a page behind them. */
	protected readonly legalLinks = FOOTER_LEGAL_NAV;

	/** Address shown next to the social networks. */
	protected readonly email = CONTACT_EMAIL;

	/** WhatsApp number, as it is shown. */
	protected readonly whatsapp = CONTACT_WHATSAPP;

	/** Link that opens a chat with that number. */
	protected readonly whatsappUrl = CONTACT_WHATSAPP_URL;

	/** Year of the copyright line. */
	protected readonly year = new Date().getFullYear();
}
