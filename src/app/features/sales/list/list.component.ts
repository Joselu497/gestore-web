import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { forkJoin, map, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { heroPencil, heroPlus, heroTrash } from '@ng-icons/heroicons/outline';
import {
  PaginationConfig,
  PaginatorComponent,
} from '../../../shared/components/paginator/paginator.component';
import { CoreComponent } from '../../../shared/components/core.component';
import { TransactionService } from '../../../_core/services/transaction.service';
import { getProductWithPrices } from '../../../_core/utils/products.utils';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, RouterModule, NgIcon],
  templateUrl: './list.component.html',
  providers: [provideIcons({ heroTrash, heroPlus, heroPencil })],
})
export class SalesComponent extends CoreComponent {
  private _transactionService = inject(TransactionService);

  isLoadingResults = signal(true);

  sales: any[] = [];
  totalData: any = {
    totalIncome: 0,
    totalGains: 0,
  };

  ngAfterViewInit() {
    this.loadData();
  }

  paginationConfig: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  };

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.loadData();
  }

  loadData() {
    this.isLoadingResults.set(true);

    forkJoin({
      total: this._transactionService.getTotal({ type: 'sale' }),
      transactions: this._transactionService.all(
        { type: 'sale' },
        ['price.product.prices'],
        this.paginationConfig.currentPage,
        this.paginationConfig.pageSize
      ),
    })
      .pipe(
        map(({ total, transactions }) => ({
          total,
          transactions: [
            transactions[0].map((sale: any) => ({
              ...sale,
              product: getProductWithPrices(sale.price.product),
            })),
            transactions[1],
          ],
        })),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: ({ total, transactions }) => {
          this.totalData = total;
          this.sales = transactions[0];
          console.log(this.sales);
          this.paginationConfig.totalItems = transactions[1];
          this.paginationConfig.totalPages = Math.ceil(
            transactions[1] / this.paginationConfig.pageSize
          );

          this.isLoadingResults.set(false);
        },
        error: (error) => {
          console.error('Error loading data:', error);
          this.isLoadingResults.set(false);
        },
      });
  }

  onDelete(id: number) {
    this._transactionService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadData();
      });
  }
}
