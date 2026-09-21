import { Routes } from '@angular/router';

/** Pages of the legal domain. */
export const LEGAL_ROUTES: Routes = [
	{
		path: 'terms',
		loadComponent: () => import('./terms/terms').then((m) => m.Terms)
	},
	{
		path: 'privacy',
		loadComponent: () => import('./privacy/privacy').then((m) => m.Privacy)
	},
	{
		path: 'data-usage',
		loadComponent: () => import('./data-usage/data-usage').then((m) => m.DataUsage)
	}
];
