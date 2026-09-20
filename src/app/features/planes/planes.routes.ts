import { Routes } from '@angular/router';

/** Pages of the planes domain. */
export const PLANES_ROUTES: Routes = [
	{
		path: '',
		title: 'Planes · Movía',
		loadComponent: () => import('./planes').then((m) => m.Planes)
	}
];
