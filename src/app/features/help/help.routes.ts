import { Routes } from '@angular/router';

/** Pages of the help domain. */
export const HELP_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./help').then((m) => m.Help)
	}
];
