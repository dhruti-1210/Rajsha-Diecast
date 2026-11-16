import type { IconName } from '../common/icon';

export type AdminView = 'dashboard' | 'inventory' | 'collection-types';

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
    ],
  },
];

export default navConfig;
