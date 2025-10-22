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
import { CoreComponent } from '../../../shared/components/core.component';
import { ProductService } from '../../../_core/services/product.service';
import { getProductWithPrices } from '../../../_core/utils/products.utils';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, PaginatorComponent, RouterModule, NgIcon],
  templateUrl: './list.component.html',
  providers: [provideIcons({ heroTrash, heroPlus, heroPencil })],
})
export class ProductsComponent extends CoreComponent {
  private _productService = inject(ProductService);

  isLoadingResults = signal(true);

  products: any[] = [];

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

    this._productService
      .all(
        {},
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
        console.log(res);
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
}
