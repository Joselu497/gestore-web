import { Pipe, PipeTransform } from "@angular/core";
import { Price } from "../../_core/interfaces/price";

@Pipe({
  name: 'activePrice'
})
export class ActivePricePipe implements PipeTransform {
  transform(prices: Price[], type: 'sale' | 'purchase'): number {
    if (!prices || !type) {
      return 0;
    }
    return prices.find(p => p.type === type && p.active)?.amount || 0;
  }
}