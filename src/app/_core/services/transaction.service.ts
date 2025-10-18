import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Transaction } from '../interfaces/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService<Transaction> {
  override url = '/transactions';
}
