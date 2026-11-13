import type { Brand, Budget } from '@/types';
export const brands: Brand[] = [
  { name: 'Hot Wheels', info: '5 models · 1:64', color: '#e03a2f', logo: 'hotwheels.png' },
  { name: 'Mini GT', info: '3 models · 1:64', color: '#888888', logo: 'minigt.png' },
  { name: 'Tarmac Works', info: '2 models · 1:64', color: '#c0262d', logo: 'tarmacworks.png' },
  { name: 'Inno64', info: '2 models · 1:64', color: '#2f6fd0', logo: 'inno64.png' },
  { name: 'Matchbox', info: '1 model · 1:64', color: '#2f7fd0', logo: 'matchbox.png' },
  { name: 'Majorette', info: '1 model · 1:64', color: '#d4af37', logo: 'majorette.png' },
  { name: 'Bburago', info: '1 model · 1:24', color: '#c0262d', logo: 'bburago.png' },
  { name: 'Maisto', info: '1 model · 1:24', color: '#6a5acd', logo: 'maisto.png' },
];
export const budgets: Budget[] = [
  { label: '₹499', sub: 'Under', max: 499 }, { label: '₹799', sub: 'Under', max: 799 },
  { label: '₹999', sub: 'Under', max: 999 }, { label: '₹1,499', sub: 'Under', max: 1499 },
  { label: '₹1,500+', sub: 'Premium', max: Infinity, premium: true },
];
