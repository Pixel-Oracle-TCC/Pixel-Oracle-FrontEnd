import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/home/home.component').then((m) => m.HomeComponent),
    title: 'PixelOracle — Evidência de reviews reais',
  },
  {
    path: 'analisar',
    loadComponent: () =>
      import('./presentation/analisar/analisar.component').then((m) => m.AnalisarComponent),
    title: 'Analisar pitch — PixelOracle',
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./presentation/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Catálogo Steam — PixelOracle',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
