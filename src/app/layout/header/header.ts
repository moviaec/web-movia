import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { HEADER_NAV } from '@core/constants/navigation.constants';

/**
 * Site header: brand, main navigation, store links and the subscribe call to action.
 * It is the same on the four pages.
 */
@Component({
	selector: 'app-header',
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.html'
})
export class Header {
	/** Links of the main navigation. */
	protected readonly navLinks = HEADER_NAV;

	/** Whether the mobile menu is open. Desktop ignores it: the nav is always visible. */
	protected readonly menuOpen = signal(false);

	/** Opens or closes the mobile menu. */
	protected toggleMenu(): void {
		this.menuOpen.update((open) => !open);
	}

	/** Closes the mobile menu, so navigating does not leave it open over the page. */
	protected closeMenu(): void {
		this.menuOpen.set(false);
	}
}
