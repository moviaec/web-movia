import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Render mode of every route. The whole landing is SSG: `outputMode: 'static'` in
 * `angular.json` means the build prerenders each route to its own HTML file and no
 * Node server is deployed.
 *
 * The catch-all keeps that true for routes added later: a new page inherits
 * `Prerender` unless it declares its own entry above this one. A route whose
 * content cannot be known at build time (one that depends on the request) has no
 * place here while there is no server to render it.
 */
export const serverRoutes: ServerRoute[] = [
	{
		path: '**',
		renderMode: RenderMode.Prerender
	}
];
