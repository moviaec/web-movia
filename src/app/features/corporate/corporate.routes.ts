import { Routes } from '@angular/router';

/** Pages of the corporate domain. */
export const CORPORATE_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./corporate').then((m) => m.Corporate)
	}
];
