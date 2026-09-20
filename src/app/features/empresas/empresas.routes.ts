import { Routes } from '@angular/router';

/** Pages of the empresas domain. */
export const EMPRESAS_ROUTES: Routes = [
	{
		path: '',
		title: 'Empresas · Movía',
		loadComponent: () => import('./empresas').then((m) => m.Empresas)
	}
];
