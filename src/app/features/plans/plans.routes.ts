import { Routes } from '@angular/router';

/** Pages of the plans domain. */
export const PLANS_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./plans').then((m) => m.Plans)
	}
];
