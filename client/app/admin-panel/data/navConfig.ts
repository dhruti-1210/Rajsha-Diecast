import type { IconName } from '../common/icon';

export type AdminView = 'dashboard' | 'inventory';

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
    ],
  },
];

export default navConfig;
