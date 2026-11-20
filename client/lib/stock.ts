export function getOnlyNLeft(stock: number | undefined, threshold: number): number {
  return stock !== undefined && stock > 0 && stock <= threshold ? stock : 0;
}
