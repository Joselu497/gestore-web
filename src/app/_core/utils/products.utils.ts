export function getProductWithPrices(product: any): any {
  const prices = product.prices || [];
  
  return {
    ...product,
    salePrice: prices.find((p: any) => p.type === 'sale' && p.active)?.amount || 0,
    purchasePrice: prices.find((p: any) => p.type === 'purchase' && p.active)?.amount || 0
  };
}