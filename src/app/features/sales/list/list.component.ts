import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { heroPencil, heroPlus, heroTrash } from '@ng-icons/heroicons/outline';
import { PaginationConfig, PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { CoreComponent } from '../../../shared/components/core.component';
import { TransactionService } from '../../../_core/services/transaction.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    RouterModule,
    NgIcon,
  ],
  templateUrl: './list.component.html',
  providers: [provideIcons({ heroTrash, heroPlus, heroPencil })],
})
export class SalesComponent extends CoreComponent {
  private _transactionService = inject(TransactionService);

  isLoadingResults = signal(true);

  sales: any[] = [];

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

    this._transactionService
      .all({ type: 'sale'}, ['price.product'], this.paginationConfig.currentPage, this.paginationConfig.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.sales = res[0];
        this.paginationConfig.totalItems = res[1];
        this.paginationConfig.totalPages = Math.ceil(
          res[1] / this.paginationConfig.pageSize
        );

        this.isLoadingResults.set(false);
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
