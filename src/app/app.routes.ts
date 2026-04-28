import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'PixelOracle — Game Intelligence para Devs Independentes',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
