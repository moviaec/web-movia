import { Routes } from '@angular/router';

/** Pages of the home domain. */
export const HOME_ROUTES: Routes = [
	{
		path: '',
		title: 'Movía · Deporte y bienestar en una sola app',
		loadComponent: () => import('./home').then((m) => m.Home)
	}
];
