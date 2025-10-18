import { Model } from "./model";
import { Price } from "./price";

export interface Transaction extends Model {
  date: Date,
  amount: number,
  price: Price,
  priceId: number,
  userId: number,
}
