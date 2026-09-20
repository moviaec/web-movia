import { Routes } from '@angular/router';

/** Pages of the estudios domain. */
export const ESTUDIOS_ROUTES: Routes = [
	{
		path: '',
		title: 'Estudios · Movía',
		loadComponent: () => import('./estudios').then((m) => m.Estudios)
	}
];
