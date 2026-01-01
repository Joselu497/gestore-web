import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { forkJoin, map, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { PaginationConfig } from '../paginator/paginator.component';
import { TransactionService } from '../../../_core/services/transaction.service';
import { getProductWithPrices } from '../../../_core/utils/products.utils';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../_core/services/product.service';
import { Product } from '../../../_core/interfaces/product';
import { TransactionFilterComponent } from './transaction-filter/transaction-filter.component';
import { PagedListComponent } from '../paged-list.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `<ng-container></ng-container>`,
})
export class TransactionsComponent extends PagedListComponent {
  filterComponent!: TransactionFilterComponent;

  private _transactionService = inject(TransactionService);
  private _productService = inject(ProductService);

  isLoadingResults = signal(true);
  type: 'sale' | 'purchase' = 'sale';

  products: Product[] = [];
  isLoadingProducts = signal(true);

  transactions: any[] = [];
  totalData: any = {
    totalIncome: 0,
    totalGains: 0,
  };

  ngAfterViewInit() {
    this.loadData();
  }

  loadData(filters: any = {}) {
    this.isLoadingResults.set(true);

    const filtersWithType = {
      ...filters,
      type: this.type,
    };

    forkJoin({
      total: this._transactionService.getTotal(filtersWithType),
      transactions: this._transactionService.all(
        filtersWithType,
        ['price.product', 'price.product.prices'],
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
          this.transactions = transactions[0];
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

  loadProducts() {
    this.isLoadingProducts.set(true);

    this._productService
      .all()
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.products = products[1];
        this.isLoadingProducts.set(false);
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
