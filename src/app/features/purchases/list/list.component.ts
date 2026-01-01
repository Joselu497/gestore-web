import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  heroFunnel,
  heroPencil,
  heroPlus,
  heroTrash,
} from '@ng-icons/heroicons/outline';
import {
  PaginatorComponent,
} from '../../../shared/components/paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { TransactionsComponent } from '../../../shared/components/transaction/transactions.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TransactionFilterComponent } from '../../../shared/components/transaction/transaction-filter/transaction-filter.component';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    RouterModule,
    NgIcon,
    FormsModule,
    NgSelectModule,
    TransactionFilterComponent
  ],
  templateUrl: './list.component.html',
  providers: [provideIcons({ heroTrash, heroPlus, heroPencil, heroFunnel })],
})
export class PurchasesComponent extends TransactionsComponent {
  override type: 'purchase' = 'purchase';
}
