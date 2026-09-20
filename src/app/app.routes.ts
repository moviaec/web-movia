import { Routes } from '@angular/router';

/**
 * Map of domains. Each domain owns its pages in `features/<domain>/<domain>.routes.ts`
 * and is registered here with `loadChildren`; the route prefix matches the folder.
 *
 * The catch-all redirects to the home page for now: the real 404 lands in
 * `shared/pages/not-found/` when that page exists.
 */
export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('@features/home/home.routes').then((m) => m.HOME_ROUTES)
	},
	{
		path: 'estudios',
		loadChildren: () => import('@features/estudios/estudios.routes').then((m) => m.ESTUDIOS_ROUTES)
	},
	{
		path: 'empresas',
		loadChildren: () => import('@features/empresas/empresas.routes').then((m) => m.EMPRESAS_ROUTES)
	},
	{
		path: 'planes',
		loadChildren: () => import('@features/planes/planes.routes').then((m) => m.PLANES_ROUTES)
	},
	{
		path: '**',
		redirectTo: ''
	}
];
