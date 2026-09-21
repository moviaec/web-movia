import { Routes } from '@angular/router';

/** Pages of the contact domain. */
export const CONTACT_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () => import('./contact').then((m) => m.Contact)
	}
];
