import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CoreComponent } from '../../shared/components/core.component';
import { ProductService } from '../../_core/services/product.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './inventory.component.html',
})
export class InventoryComponent extends CoreComponent {
  private _productService = inject(ProductService);

  isLoadingResults = signal(true);

  inventory: any[] = [];

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    this.isLoadingResults.set(true);

    this._productService
      .getInventory()
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe((res: any) => {
        this.inventory = res;

        this.isLoadingResults.set(false);
      });
  }
}
