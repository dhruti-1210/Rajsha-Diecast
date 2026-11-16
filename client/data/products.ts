import type { Product } from '@/types';
// image = file in /public/images/products. If missing, a coloured SVG car is shown.
export const products: Product[] = [
  { id: 1, name: 'Nissan GT-R (R35) Nismo', brand: 'Mini GT', scale: '1:64', price: 1199, condition: 'Sealed', color: '#e8e8e8', left: 0, image: 'gtr.jpg' },
  { id: 2, name: 'Porsche 911 GT3 R', brand: 'Tarmac Works', scale: '1:64', price: 1899, condition: 'Sealed', color: '#f2c418', left: 1, image: 'gt3r.jpg' },
  { id: 3, name: 'Honda Civic Type R (FK8)', brand: 'Inno64', scale: '1:64', price: 1599, condition: 'Sealed', color: '#e53935', left: 2, image: 'civic.jpg' },
  { id: 4, name: 'Ferrari SF90 Stradale', brand: 'Bburago', scale: '1:24', price: 2499, condition: 'Sealed', color: '#d62828', left: 2, image: 'sf90.jpg' },
  { id: 5, name: 'Toyota Land Cruiser', brand: 'Inno64', scale: '1:64', price: 1649, condition: 'Opened', color: '#e0d3a8', left: 2, image: 'lc.jpg' },
  { id: 6, name: 'Toyota GR86', brand: 'Mini GT', scale: '1:64', price: 1099, condition: 'Sealed', color: '#2f6fd0', left: 0, image: 'gr86.jpg' },
  { id: 7, name: 'Hot Wheels Fast & Furious', brand: 'Hot Wheels', scale: '1:64', price: 449, condition: 'Damage', color: '#ff7a1a', left: 1, image: 'hw1.jpg' },
  { id: 8, name: 'Majorette Street Racer', brand: 'Majorette', scale: '1:64', price: 699, condition: 'Sealed', color: '#f2c418', left: 3, image: 'maj.jpg' },
  { id: 9, name: 'Toyota Supra Mk4', brand: 'Mini GT', scale: '1:64', price: 1399, condition: 'Sealed', color: '#d62828', left: 2, image: 'supra.jpg' },
  { id: 10, name: 'Lamborghini Huracán STO', brand: 'Bburago', scale: '1:24', price: 2299, condition: 'Sealed', color: '#f2c418', left: 1, image: 'huracan.jpg' },
  { id: 11, name: 'Nissan Skyline GT-R R34', brand: 'Hot Wheels', scale: '1:64', price: 799, condition: 'Opened', color: '#2f6fd0', left: 2, image: 'skyline.jpg' },
  { id: 12, name: 'McLaren 720S', brand: 'Tarmac Works', scale: '1:64', price: 1799, condition: 'Sealed', color: '#ff7a1a', left: 1, image: 'mclaren.jpg' },
  { id: 13, name: 'BMW M3 E30', brand: 'Inno64', scale: '1:64', price: 1599, condition: 'Sealed', color: '#e8e8e8', left: 3, image: 'bmw-m3.jpg' },
  { id: 14, name: 'Mercedes-AMG GT', brand: 'Majorette', scale: '1:64', price: 849, condition: 'Sealed', color: '#555b63', left: 2, image: 'amg-gt.jpg' },
  { id: 15, name: 'Bugatti Chiron', brand: 'Bburago', scale: '1:24', price: 1999, condition: 'Damage', color: '#2455a4', left: 1, image: 'chiron.jpg' },
  { id: 16, name: 'Ford Mustang Shelby GT500', brand: 'Mini GT', scale: '1:64', price: 1499, condition: 'Opened', color: '#23395d', left: 2, image: 'mustang.jpg' },
];
