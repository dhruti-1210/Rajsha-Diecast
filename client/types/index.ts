export type Condition = 'Sealed' | 'Opened' | 'Damage';
export interface Product {
  id: number | string; name: string; brand: string; scale: string; price: number;
  condition: string; color: string; left: number; image: string; images?: string[]; stock?: number;
}
export interface Brand { name: string; info: string; color: string; logo: string }
export interface Budget { label: string; sub: string; max: number; premium?: boolean }
