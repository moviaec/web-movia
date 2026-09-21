import { Routes } from '@angular/router';

/** Pages of the legal domain. */
export const LEGAL_ROUTES: Routes = [
	/*
	 * El path vacío es la razón de este cambio, no un extra: SIN él el prerender
	 * seguía escribiendo `legal/index.html`, porque la ruta padre existe, y lo que
	 * salía era una página indexable con el `<main>` vacío (hallazgo 8).
	 */
	{
		path: '',
		loadComponent: () => import('./legal-index/legal-index').then((m) => m.LegalIndex)
	},
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
