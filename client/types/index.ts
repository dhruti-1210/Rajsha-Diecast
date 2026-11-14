export type Condition = 'Sealed' | 'Opened' | 'Damage';
export interface Product {
  id: number; name: string; brand: string; scale: string; price: number;
  condition: Condition; color: string; left: number; image: string;
}
export interface Brand { name: string; info: string; color: string; logo: string }
export interface Budget { label: string; sub: string; max: number; premium?: boolean }
