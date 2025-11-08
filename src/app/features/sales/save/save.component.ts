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
import { AuthService } from '../../../_core/services/auth.service';
import { TransactionService } from '../../../_core/services/transaction.service';
import { Transaction } from '../../../_core/interfaces/transaction';
import moment from 'moment';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductService } from '../../../_core/services/product.service';
import { Product } from '../../../_core/interfaces/product';
import { Price } from '../../../_core/interfaces/price';
import { PriceService } from '../../../_core/services/price.service';

@Component({
  selector: 'app-save-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './save.component.html',
})
export class SaveTransactionComponent extends CoreComponent implements OnInit {
  private _fb = inject(FormBuilder);
  private _transactionService = inject(TransactionService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _authService = inject(AuthService);
  private _productService = inject(ProductService);
  private _priceService = inject(PriceService);

  transactionForm!: FormGroup;
  isEditing = false;
  transactionId: string | null = null;
  transaction?: Transaction;
  products: Product[] = [];
  prices: Price[] = [];
  isLoadingProducts = signal(false);

  ngOnInit() {
    this.checkEditMode();
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.transactionForm
      .get('productId')
      ?.valueChanges.subscribe((value: any) => {
        this._priceService
          .all({ paginate: false, productId: value, type: 'sale' })
          .subscribe((prices) => {
            this.prices = prices[0];

            const activePrice = this.prices.find((item: Price) => item.active);

            this.transactionForm
              .get('priceId')
              ?.setValue(activePrice?.id || null);
          });
      });
  }

  private initForm(): void {
    this.loadProducts();
    this.transactionForm = this._fb.group({
      date: [moment('2025-09-22').format('YYYY-MM-DD'), [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      productId: [null, [Validators.required]],
      priceId: [null, [Validators.required]],
    });
  }

  private checkEditMode(): void {
    this.transactionId = this._route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.isEditing = true;
      this.loadTransactionData(this.transactionId);
    }
  }

  private loadTransactionData(id: string): void {
    this._transactionService
      .get(id, {}, ['price'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((transaction: Transaction) => {
        this.transaction = transaction;
        this.transactionForm.patchValue({
          date: moment(transaction.date).format('YYYY-MM-DD'),
          amount: transaction.amount,
          productId: transaction.price.productId,
          priceId: transaction.priceId,
        });
      });
  }

  private loadProducts(): void {
    this.isLoadingProducts.set(true);
    this._productService
      .all({ paginate: false }, ['prices'])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: any) => {
          this.products = products[0];
          this.isLoadingProducts.set(false);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoadingProducts.set(false);
        },
      });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transactionData = {
        date: formValue.date,
        amount: formValue.amount,
        priceId: formValue.priceId,
        type: 'sale',
      };

      this._transactionService
        .save(this.transactionId, transactionData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this._router.navigate(['../sales']);
          },
          error: (error: any) => {
            console.error('Error saving transaction:', error);
          },
        });
    }
  }

  onCancel(): void {
    this._router.navigate(['../sales']);
  }
}
