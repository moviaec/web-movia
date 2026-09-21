import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TitleStrategy, provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { SeoTitleStrategy } from '@core/services/seo-title.strategy';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes, withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' }), withViewTransitions()),
		provideBrowserGlobalErrorListeners(),
		/** Replays the clicks that land before the JS hydrates; without it, a CTA pressed early does nothing. */
		provideClientHydration(withEventReplay()),
		/**
		 * The site has no backend and loads no data: the ONLY remote call is the contact
		 * form, which posts to `api-movia` (see `docs/decisiones/`). `withFetch()` because
		 * the build prerenders every route and `fetch` is what runs on both sides.
		 */
		provideHttpClient(withFetch()),
		/**
		 * Title, description, canonical and social tags of every route, from
		 * `core/constants/seo.constants.ts`. It replaces the default strategy, which only
		 * set the title: the hook is the same one and it already runs while prerendering,
		 * so everything it writes ends up baked into each route's HTML file.
		 */
		{ provide: TitleStrategy, useExisting: SeoTitleStrategy }
	]
};
