import { Routes } from "@angular/router";
import { SalesComponent } from "./list/list.component";
import { SaveTransactionComponent } from "./save/save.component";

export const salesRoutes: Routes = [
  {
    path: '',
    component: SalesComponent,
  },
    {
      path: 'save',
      component: SaveTransactionComponent,
    },
    {
      path: 'save/:id',
      component: SaveTransactionComponent,
    },
];
