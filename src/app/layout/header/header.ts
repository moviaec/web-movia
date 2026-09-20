import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { HEADER_NAV } from '@core/constants/navigation.constants';

/**
 * Site header: brand, main navigation, store links and the subscribe call to action.
 * It is the same on the four pages and always sits ON TOP of a dark first section,
 * so it has no background of its own.
 */
@Component({
	selector: 'app-header',
	host: { class: 'absolute inset-x-0 top-0 z-30 block' },
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
