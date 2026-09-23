import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { FALLBACK_SEO, ROUTE_SEO } from '@core/constants/seo.constants';
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_LOCALE, SITE_NAME } from '@core/constants/site.constants';
import { RouteSeo } from '@core/interfaces/seo.interface';
import { JsonLdNode } from '@core/types/json-ld.type';

import { environment } from '../../../environments/environment';

/**
 * Writes the metadata of the current route into the document head.
 *
 * It runs on EVERY navigation, and that includes the prerender: the build navigates
 * to each route in a server DOM and writes the resulting HTML to disk, so what this
 * service sets is what WhatsApp, Facebook and Google end up reading. Anything guarded
 * by `afterNextRender` or `isPlatformBrowser` would not be in that file and would not
 * have served for anything — the way to check it is `grep 'og:' dist/…/index.html`,
 * never the browser.
 *
 * Nothing here is composed by hand: the absolute URLs come from `environment.siteUrl`
 * and the copy from `core/constants/seo.constants.ts`.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
	private readonly _document = inject(DOCUMENT);
	private readonly _meta = inject(Meta);
	private readonly _title = inject(Title);

	/**
	 * Applies the metadata of the route the given URL resolves to.
	 *
	 * @param url URL of the navigation, as the router serialises it (it may carry a
	 *   query string or a fragment; neither belongs in a canonical).
	 */
	apply(url: string): void {
		const path = this._normalizePath(url);
		const seo = ROUTE_SEO[path] ?? FALLBACK_SEO;
		const canonical = this._absolute(path);
		const image = this._absolute(seo.image ?? DEFAULT_OG_IMAGE);

		this._title.setTitle(seo.title);
		this._meta.updateTag({ name: 'description', content: seo.description });
		this._setCanonical(canonical);
		this._setRobots(seo);
		this._setOpenGraph(seo, canonical, image);
		this._setTwitter(seo, image);
		this._setStructuredData(seo);
	}

	/**
	 * Adds a JSON-LD block that depends on data loaded after the navigation.
	 *
	 * It is the way in for the `Product` of `/plans`, whose prices come from the API.
	 * The block carries the same `data-seo` mark as the route's own, so the next
	 * navigation removes it like any other: it cannot outlive its page.
	 */
	addStructuredData(node: JsonLdNode): void {
		this._appendStructuredData(node);
	}

	/**
	 * Turns a navigation URL into the path the metadata is keyed by: no query, no
	 * fragment and no trailing slash, which is the single criterion of the whole site.
	 */
	private _normalizePath(url: string): string {
		const path = url.split('?')[0].split('#')[0];
		if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
		return path;
	}

	/** Composes an absolute URL from the public base. The root keeps no trailing slash either. */
	private _absolute(path: string): string {
		if (path === '/') return environment.siteUrl;
		return `${environment.siteUrl}${path}`;
	}

	/**
	 * Points the canonical at the page itself.
	 *
	 * The `<link>` is looked up and REUSED instead of appended: on the client the same
	 * head survives every navigation, and appending would leave one canonical per page
	 * visited — which is worse than having none, because Google then picks one.
	 */
	private _setCanonical(canonical: string): void {
		const head = this._document.head;
		let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

		if (!link) {
			link = this._document.createElement('link');
			link.setAttribute('rel', 'canonical');
			head.appendChild(link);
		}

		link.setAttribute('href', canonical);
	}

	/**
	 * Adds or removes the `noindex`.
	 *
	 * Removing it matters as much as adding it: navigating from a legal page to the home
	 * would otherwise leave the tag behind and take the home out of the index.
	 */
	private _setRobots(seo: RouteSeo): void {
		if (seo.indexable) {
			this._meta.removeTag('name="robots"');
			return;
		}

		this._meta.updateTag({ name: 'robots', content: 'noindex, follow' });
	}

	/** The card that WhatsApp, Facebook and LinkedIn read. None of the four runs JavaScript. */
	private _setOpenGraph(seo: RouteSeo, canonical: string, image: string): void {
		this._meta.updateTag({ property: 'og:title', content: seo.title });
		this._meta.updateTag({ property: 'og:description', content: seo.description });
		this._meta.updateTag({ property: 'og:url', content: canonical });
		this._meta.updateTag({ property: 'og:type', content: 'website' });
		this._meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
		this._meta.updateTag({ property: 'og:locale', content: SITE_LOCALE });
		this._meta.updateTag({ property: 'og:image', content: image });
		this._meta.updateTag({ property: 'og:image:width', content: OG_IMAGE_WIDTH });
		this._meta.updateTag({ property: 'og:image:height', content: OG_IMAGE_HEIGHT });
		this._meta.updateTag({ property: 'og:image:alt', content: seo.imageAlt ?? DEFAULT_OG_IMAGE_ALT });
	}

	/**
	 * Writes the JSON-LD blocks of the route, one `<script>` each.
	 *
	 * The ones of the previous route are REMOVED first, and they are found by the
	 * `data-seo` attribute: on the client the head survives every navigation, and without
	 * this the `Product` of `/plans` would still be declared while reading the home.
	 *
	 * The content goes in through `textContent` and never as HTML, so a quote or a `<` in
	 * the copy cannot close the tag.
	 */
	private _setStructuredData(seo: RouteSeo): void {
		const head = this._document.head;
		for (const script of Array.from(head.querySelectorAll('script[type="application/ld+json"][data-seo]'))) script.remove();
		if (!seo.structuredData?.length) return;

		for (const node of seo.structuredData) this._appendStructuredData(node);
	}

	/** Writes one JSON-LD block into the head, marked with `data-seo` so the next route removes it. */
	private _appendStructuredData(node: JsonLdNode): void {
		const script = this._document.createElement('script');
		script.setAttribute('type', 'application/ld+json');
		script.setAttribute('data-seo', '');
		script.textContent = JSON.stringify(node);
		this._document.head.appendChild(script);
	}

	/** X reads its own names; without them it falls back to the small card with no photo. */
	private _setTwitter(seo: RouteSeo, image: string): void {
		this._meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
		this._meta.updateTag({ name: 'twitter:title', content: seo.title });
		this._meta.updateTag({ name: 'twitter:description', content: seo.description });
		this._meta.updateTag({ name: 'twitter:image', content: image });
		this._meta.updateTag({ name: 'twitter:image:alt', content: seo.imageAlt ?? DEFAULT_OG_IMAGE_ALT });
	}
}
