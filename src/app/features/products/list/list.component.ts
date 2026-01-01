import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { map, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { heroPencil, heroPlus, heroTrash } from '@ng-icons/heroicons/outline';
import {
  PaginationConfig,
  PaginatorComponent,
} from '../../../shared/components/paginator/paginator.component';
import { ProductService } from '../../../_core/services/product.service';
import { getProductWithPrices } from '../../../_core/utils/products.utils';
import { PagedListComponent } from '../../../shared/components/paged-list.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, RouterModule, NgIcon],
  templateUrl: './list.component.html',
  providers: [provideIcons({ heroTrash, heroPlus, heroPencil })],
})
export class ProductsComponent extends PagedListComponent {
  private _productService = inject(ProductService);

  isLoadingResults = signal(true);
  searchTerm = signal('');
  searchTimeout: any;

  products: any[] = [];

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    this.isLoadingResults.set(true);

    this._productService
      .all(
        { name: this.searchTerm() },
        ['prices'],
        this.paginationConfig.currentPage,
        this.paginationConfig.pageSize
      )
      .pipe(
        takeUntil(this.destroy$),
        map((res: any) => [
          res[0].map((product: any) => getProductWithPrices(product)),
          res[1],
        ])
      )
      .subscribe((res: any) => {
        this.products = res[0];
        this.paginationConfig.totalItems = res[1];
        this.paginationConfig.totalPages = Math.ceil(
          res[1] / this.paginationConfig.pageSize
        );

        this.isLoadingResults.set(false);
      });
  }

  onDelete(id: number) {
    this._productService
      .delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadData();
      });
  }

  onSearchChange(event: any) {
    clearTimeout(this.searchTimeout);
    const searchValue = event.target.value || '';
    this.searchTimeout = setTimeout(() => {
      this.searchTerm.set(searchValue);
      this.loadData();
    }, 500);
  }
}
