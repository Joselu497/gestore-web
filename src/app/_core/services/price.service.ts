import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Price } from '../interfaces/price';

@Injectable({
  providedIn: 'root'
})
export class PriceService extends BaseService<Price> {
  override url = '/prices';
}
