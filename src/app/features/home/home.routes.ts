import { Routes } from '@angular/router';

/** Pages of the home domain. */
export const HOME_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./home').then((m) => m.Home)
	}
];
