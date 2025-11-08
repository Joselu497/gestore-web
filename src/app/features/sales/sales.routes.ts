import { Routes } from '@angular/router';
import { SalesComponent } from './list/list.component';
import { SaveSaleComponent } from './save/save.component';

export const salesRoutes: Routes = [
  {
    path: '',
    component: SalesComponent,
  },
  {
    path: 'save',
    component: SaveSaleComponent,
  },
  {
    path: 'save/:id',
    component: SaveSaleComponent,
  },
];
