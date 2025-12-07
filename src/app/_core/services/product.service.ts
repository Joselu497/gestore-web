import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<Product> {
  override url = '/products';

  getInventory() {
    return this.http.get<any>(this.getUrl() + '/inventory');
  }
}
