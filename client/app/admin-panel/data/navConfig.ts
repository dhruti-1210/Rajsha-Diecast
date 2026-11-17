import type { IconName } from '../common/icon';

export type AdminView =
  | 'dashboard'
  | 'inventory'
  | 'collection-types'
  | 'packaging-types'
  | 'scale-sizes'
  | 'company-setup'
  | 'banners'
  | 'cms'
  | 'checkout'
  | 'brands'
  | 'review-master'
  | 'footer-link-groups'
  | 'footer-links';

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
      { label: 'Brand master', href: '#brands', id: 'brands', icon: 'tag' },
      { label: 'Collection types', href: '#collection-types', id: 'collection-types', icon: 'tag' },
      { label: 'Packaging types', href: '#packaging-types', id: 'packaging-types', icon: 'box' },
      { label: 'Scale sizes', href: '#scale-sizes', id: 'scale-sizes', icon: 'box' },
      { label: 'Company setup', href: '#company-setup', id: 'company-setup', icon: 'tag' },
      { label: 'Banners', href: '#banners', id: 'banners', icon: 'box' },
      { label: 'CMS', href: '#cms', id: 'cms', icon: 'tag' },
      { label: 'Checkout', href: '#checkout', id: 'checkout', icon: 'box' },
      { label: 'Reviews', href: '#review-master', id: 'review-master', icon: 'tag' },
      { label: 'Footer link groups', href: '#footer-link-groups', id: 'footer-link-groups', icon: 'tag' },
      { label: 'Footer links', href: '#footer-links', id: 'footer-links', icon: 'tag' },
    ],
  },
];

export default navConfig;
