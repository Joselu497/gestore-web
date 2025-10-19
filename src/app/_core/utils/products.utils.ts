export function getProductWithPrices(product: any): any {
  const prices = product.prices || [];
  
  return {
    ...product,
    salePrice: prices.find((p: any) => p.type === 'sale')?.amount || 0,
    purchasePrice: prices.find((p: any) => p.type === 'purchase')?.amount || 0
  };
}