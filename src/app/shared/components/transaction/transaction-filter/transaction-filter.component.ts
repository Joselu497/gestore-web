import { CommonModule } from '@angular/common';
import { Component, inject, output, signal } from '@angular/core';
import { takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CoreComponent } from '../../core.component';
import { ProductService } from '../../../../_core/services/product.service';
import { Product } from '../../../../_core/interfaces/product';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './transaction-filter.component.html',
})
export class TransactionFilterComponent extends CoreComponent {
  private _fb = inject(FormBuilder);
  private _productService = inject(ProductService);

  resetList = output<any>();
  filter = output<any>();

  isLoadingResults = signal(true);

  products: Product[] = [];
  isLoadingProducts = signal(true);

  filterForm!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((filterValue) => {
        const filters = Object.entries(filterValue).reduce(
          (filter: any, [key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              filter[key] = value;
            }
            return filter;
          },
        );

        this.filter.emit(filters);
      });
  }

  clearFilters() {
    this.filterForm.reset();
    this.resetList.emit(null);
  }

  private initForm(): void {
    this.loadProducts();
    this.filterForm = this._fb.group({
      startDate: [null],
      endDate: [null],
      productId: [null],
    });
  }

  loadProducts() {
    this.isLoadingProducts.set(true);

    this._productService
      .all({ pagination: false })
      .pipe(takeUntil(this.destroy$))
      .subscribe((products) => {
        this.products = products;
        this.isLoadingProducts.set(false);
      });
  }
}
