import { Model } from "./model";
import { Product } from "./product";

export interface Price extends Model {
  amount: number;
  type: 'sale' | 'purchase';
  active: boolean;
  productId?: number;
  Product?: Product;
}