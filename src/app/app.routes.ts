import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'config/user',
    loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
    canActivate: [authGuard],
  },
  {
    path: 'privilegio',
    loadComponent: () => import('./privilegio/privilegio.component').then(m => m.PrivilegioComponent),
    canActivate: [authGuard],
  },
  {
    path: 'voluntario',
    loadComponent: () => import('./voluntario/voluntario.component').then(m => m.VoluntarioComponent),
    canActivate: [authGuard],
  },
  {
    path: 'designacao',
    loadComponent: () => import('./designacao/designacao.component').then(m => m.DesignacaoComponent),
    canActivate: [authGuard],
  },
  {
    path: 'designacao/novo',
    loadComponent: () =>
      import('./designacao/pages/create/designacao.create.component').then(
        m => m.DesignacaoCreateComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'escola',
    loadComponent: () => import('./escola/escola.component').then(m => m.EscolaComponent),
    canActivate: [authGuard],
  },
  {
    path: 'reuniao',
    loadComponent: () => import('./escola/escola.component').then(m => m.EscolaComponent),
    canActivate: [authGuard],
  },
];
