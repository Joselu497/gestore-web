import { Model } from "./model";
import { Price } from "./price";

export interface Product extends Model {
  name: string,
  prices: Price[],
  userId: number,
}
