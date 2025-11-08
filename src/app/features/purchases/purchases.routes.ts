import { Routes } from "@angular/router";
import { PurchasesComponent } from "./list/list.component";
import { SavePurchaseComponent } from "./save/save.component";

export const purchasesRoutes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
  },
    {
      path: 'save',
      component: SavePurchaseComponent,
    },
    {
      path: 'save/:id',
      component: SavePurchaseComponent,
    },
];
