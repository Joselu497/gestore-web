import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { authUserGuard } from './_core/guards/auth.guard';
import { LayoutComponent } from './features/layout/layout.component';
import { productsRoutes } from './features/products/products.routes';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authUserGuard],
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
      {
        path: 'products',
        children: productsRoutes
      },
    ],
  },
];
