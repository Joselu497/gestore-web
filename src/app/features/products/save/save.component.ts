import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { CoreComponent } from '../../../shared/components/core.component';
import { ProductService } from '../../../_core/services/product.service';
import { Product } from '../../../_core/interfaces/product';
import { AuthService } from '../../../_core/services/auth.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCheck,
  heroPlus,
  heroTrash,
  heroXMark,
} from '@ng-icons/heroicons/outline';
import { Price } from '../../../_core/interfaces/price';

@Component({
  selector: 'app-save-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgIcon],
  templateUrl: './save.component.html',
  providers: [provideIcons({ heroTrash, heroPlus, heroXMark, heroCheck })],
})
export class SaveProductComponent extends CoreComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _productService = inject(ProductService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _authService = inject(AuthService);

  productForm!: FormGroup;
  isEditing = false;
  productId: string | null = null;
  product?: Product;
  prices?: Price[] = [];
  addingSalePrice = signal(false);
  addingPurchasePrice = signal(false);

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.productForm = this._fb.group({
      name: ['', [Validators.required]],
    });
  }

  private checkEditMode(): void {
    this.productId = this._route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditing = true;
      this.loadProductData(this.productId);
    }
  }

  private loadProductData(id: string): void {
    this._productService
      .get(id, {}, ['prices'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((product: Product) => {
        this.product = product;
        this.prices = product.prices;
        this.productForm.patchValue({
          name: product.name,
        });
      });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const userId = this._authService.currentUserValue.id;

      const formValue = this.productForm.value;
      const productData = {
        name: formValue.name,
        userId,
        prices: this.prices,
      };

      this._productService
        .save(this.productId, productData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this._router.navigate(['../products']);
          },
          error: (error: any) => {
            console.error('Error saving product:', error);
          },
        });
    }
  }

  onAddPrice(value: number, type: 'sale' | 'purchase') {
    this.prices?.push({
      amount: value,
      type,
      active: true,
    });
    type == 'sale' ? this.addingSalePrice.set(false) : this.addingPurchasePrice.set(false);
  }

  onCancel(): void {
    this._router.navigate(['../products']);
  }
}
