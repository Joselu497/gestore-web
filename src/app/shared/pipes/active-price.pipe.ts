import { Pipe, PipeTransform } from "@angular/core";
import { Price } from "../../_core/interfaces/price";

@Pipe({
  name: 'activePrice'
})
export class ActivePricePipe implements PipeTransform {
  transform(prices: Price[], type: 'sale' | 'purchase'): Price | undefined {
    if (!prices || !type) {
      return undefined;
    }
    return prices.find(p => p.type === type && p.active);
  }
}