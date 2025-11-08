import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { SaveTransactionComponent } from '../../../shared/components/transaction/save-transaction.component';

@Component({
  selector: 'app-save-purchase',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './save.component.html',
})
export class SavePurchaseComponent extends SaveTransactionComponent {
  override type: 'purchase' = 'purchase';
}
