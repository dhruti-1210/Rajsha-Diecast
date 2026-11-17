import type { IconName } from '../common/icon';

export type AdminView = 'dashboard' | 'inventory' | 'collection-types' | 'packaging-types';

export type AdminNavSection = {
  title: string;
  items: {
    label: string;
    href: string;
    id: AdminView;
    icon: IconName;
  }[];
};

const navConfig: AdminNavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Dashboard', href: '#dashboard', id: 'dashboard', icon: 'box' },
      { label: 'Inventory', href: '#inventory', id: 'inventory', icon: 'car' },
      { label: 'Collection types', href: '#collection-types', id: 'collection-types', icon: 'tag' },
      { label: 'Packaging types', href: '#packaging-types', id: 'packaging-types', icon: 'box' },
    ],
  },
];

export default navConfig;
