import { Routes } from '@angular/router';

/**
 * Map of domains. Each domain owns its pages in `features/<domain>/<domain>.routes.ts`
 * and is registered here with `loadChildren`; the route prefix matches the folder.
 *
 * The catch-all shows the 404 page of `shared/pages/not-found/`, which is not a
 * domain and therefore does not live in `features/` (`RULES.md` rule 11). It used to
 * redirect to the home: that turns every wrong URL into a home page served with a
 * 200 —a soft 404— and reads, to whoever typed it, as the site rejecting them.
 */
export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('@features/home/home.routes').then((m) => m.HOME_ROUTES)
	},
	{
		path: 'partners',
		loadChildren: () => import('@features/partners/partners.routes').then((m) => m.PARTNERS_ROUTES)
	},
	{
		path: 'corporate',
		loadChildren: () => import('@features/corporate/corporate.routes').then((m) => m.CORPORATE_ROUTES)
	},
	{
		path: 'plans',
		loadChildren: () => import('@features/plans/plans.routes').then((m) => m.PLANS_ROUTES)
	},
	{
		path: 'contact',
		loadChildren: () => import('@features/contact/contact.routes').then((m) => m.CONTACT_ROUTES)
	},
	{
		path: 'legal',
		loadChildren: () => import('@features/legal/legal.routes').then((m) => m.LEGAL_ROUTES)
	},
	{
		path: 'help',
		loadChildren: () => import('@features/help/help.routes').then((m) => m.HELP_ROUTES)
	},
	{
		path: '**',
		loadComponent: () => import('@shared/pages/not-found/not-found').then((m) => m.NotFound)
	}
];
