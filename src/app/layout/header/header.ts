import { Component, afterNextRender, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { EXTERNAL_LINKS } from '@core/constants/external-links.constants';
import { HEADER_NAV } from '@core/constants/navigation.constants';

/**
 * Scroll at which the header stops being transparent, in pixels.
 *
 * Small on purpose: the point is to leave the transparent state as soon as the
 * page moves at all, not to wait for a section to go by. It is not zero because
 * the elastic scroll of a trackpad bounces around it and the bar would blink.
 */
const SCROLL_THRESHOLD = 16;

/**
 * Site header: brand, main navigation, store links and the subscribe call to action.
 *
 * It is FIXED to the top of the viewport and the same on every page. At the top of a
 * page it has no background of its own, because it sits on a dark first section and
 * the design lets the hero photo reach the edge; as soon as the page scrolls it takes
 * the carbon background, since from there on it is flying over content of any colour.
 */
@Component({
	selector: 'app-header',
	host: {
		class: 'fixed inset-x-0 top-0 z-30 block transition-colors duration-300',
		'[class.bg-secondary]': 'solid()',
		'[class.shadow-lg]': 'scrolled()',
		'(window:scroll)': 'onScroll()'
	},
	imports: [RouterLink, RouterLinkActive],
	templateUrl: './header.html'
})
export class Header {
	private readonly _router = inject(Router);

	constructor() {
		// Reloading half way down a page restores the scroll position WITHOUT firing a
		// scroll event, so the initial state is read once, already in the browser:
		// `afterNextRender` never runs while prerendering, where there is no window.
		afterNextRender(() => this.onScroll());

		// ANY navigation closes the drawer, not only the one started from its own links:
		// a link in the footer, the browser's back button or a redirect leave it open
		// otherwise, and since the bar is fixed it would stay stuck to the screen on top
		// of the new page.
		this._router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntilDestroyed()
			)
			.subscribe(() => this.closeMenu());
	}

	/** Links of the main navigation. */
	protected readonly navLinks = HEADER_NAV;

	/** Store links of the badges. They are `#` until the real URLs exist. */
	protected readonly externalLinks = EXTERNAL_LINKS;

	/** Whether the mobile menu is open. Desktop ignores it: the nav is always visible. */
	protected readonly menuOpen = signal(false);

	/** Whether the page has moved away from the top. */
	protected readonly scrolled = signal(false);

	/**
	 * Whether the bar needs a background of its own.
	 *
	 * The open mobile menu counts as much as the scroll: the panel hangs from the bar
	 * with its own carbon background, and a transparent bar on top of it would leave
	 * the logo floating over a strip of the hero.
	 */
	protected readonly solid = computed(() => this.scrolled() || this.menuOpen());

	/** Reads how far the page has scrolled. Bound to `window:scroll` on the host. */
	protected onScroll(): void {
		this.scrolled.set(window.scrollY > SCROLL_THRESHOLD);
	}

	/** Opens or closes the mobile menu. */
	protected toggleMenu(): void {
		this.menuOpen.update((open) => !open);
	}

	/** Closes the mobile menu, so navigating does not leave it open over the page. */
	protected closeMenu(): void {
		this.menuOpen.set(false);
	}
}
