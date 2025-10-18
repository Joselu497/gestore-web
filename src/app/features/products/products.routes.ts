import { Routes } from "@angular/router";
import { ProductsComponent } from "./list/list.component";
import { SaveProductComponent } from "./save/save.component";

export const productsRoutes: Routes = [
  {
    path: '',
    component: ProductsComponent,
  },
  {
    path: 'save',
    component: SaveProductComponent,
  },
  {
    path: 'save/:id',
    component: SaveProductComponent,
  },
];
