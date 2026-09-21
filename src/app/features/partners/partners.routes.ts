import { Routes } from '@angular/router';

/** Pages of the partners domain. */
export const PARTNERS_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./partners').then((m) => m.Partners)
	}
];
