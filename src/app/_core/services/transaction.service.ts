import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Transaction } from '../interfaces/transaction';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService extends BaseService<Transaction> {
  override url = '/transactions';

  getTotal(params: any): Observable<any> {
    return this.http.get<any>(this.getUrl() + '/total', {
      params: this.getParams(params),
    });
  }
}
