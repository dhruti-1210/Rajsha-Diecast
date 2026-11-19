import type { IconName } from '../common/AdminIcon';

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
  items: ({
    label: string;
    href: string;
    id: AdminView;
    icon: IconName;
  } | {
    label: string;
    icon: IconName;
    items: {
      label: string;
      href: string;
      id: AdminView;
      icon: IconName;
    }[];
  })[];
};

const navConfig: AdminNavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Dashboard', href: '#dashboard', id: 'dashboard', icon: 'box' },
      {
        label: 'Manage inventory',
        icon: 'car',
        items: [
          { label: 'Inventory', href: '#inventory', id: 'inventory', icon: 'car' },
          { label: 'Brand master', href: '#brands', id: 'brands', icon: 'tag' },
          { label: 'Collection types', href: '#collection-types', id: 'collection-types', icon: 'collection' },
          { label: 'Packaging types', href: '#packaging-types', id: 'packaging-types', icon: 'box' },
          { label: 'Scale sizes', href: '#scale-sizes', id: 'scale-sizes', icon: 'ruler' },
        ],
      },
      {
        label: 'Company profile',
        icon: 'building',
        items: [
          { label: 'Company setup', href: '#company-setup', id: 'company-setup', icon: 'building' },
          { label: 'Banner image', href: '#banners', id: 'banners', icon: 'image' },
        ],
      },
      { label: 'CMS master', href: '#cms', id: 'cms', icon: 'file' },
      {
        label: 'User orders',
        icon: 'cart',
        items: [
          { label: 'Reviews', href: '#review-master', id: 'review-master', icon: 'star' },
          { label: 'Checkout', href: '#checkout', id: 'checkout', icon: 'cart' },
        ],
      },
      {
        label: 'Manage footer',
        icon: 'links',
        items: [
          { label: 'Footer link group', href: '#footer-link-groups', id: 'footer-link-groups', icon: 'collection' },
          { label: 'Footer link', href: '#footer-links', id: 'footer-links', icon: 'links' },
        ],
      },
    ],
  },
];

export default navConfig;
