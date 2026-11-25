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
  | 'footer-links'
  | 'user-details';

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
      { label: 'Dashboard', href: '/admin-panel', id: 'dashboard', icon: 'box' },
      {
        label: 'Manage inventory',
        icon: 'car',
        items: [
          { label: 'Inventory', href: '/admin-panel/inventory', id: 'inventory', icon: 'car' },
          { label: 'Brand master', href: '/admin-panel/brands', id: 'brands', icon: 'tag' },
          { label: 'Collection types', href: '/admin-panel/collection-types', id: 'collection-types', icon: 'collection' },
          { label: 'Packaging types', href: '/admin-panel/packaging-types', id: 'packaging-types', icon: 'box' },
          { label: 'Scale sizes', href: '/admin-panel/scale-sizes', id: 'scale-sizes', icon: 'ruler' },
        ],
      },
      {
        label: 'Company profile',
        icon: 'building',
        items: [
          { label: 'Company setup', href: '/admin-panel/company-setup', id: 'company-setup', icon: 'building' },
          { label: 'Banner image', href: '/admin-panel/banners', id: 'banners', icon: 'image' },
        ],
      },
      { label: 'CMS master', href: '/admin-panel/cms', id: 'cms', icon: 'file' },
      {
        label: 'User orders',
        icon: 'cart',
        items: [
          { label: 'User details', href: '/admin-panel/user-details', id: 'user-details', icon: 'user' },
          { label: 'Reviews', href: '/admin-panel/review-master', id: 'review-master', icon: 'star' },
          { label: 'Checkout', href: '/admin-panel/checkout', id: 'checkout', icon: 'cart' },
        ],
      },
      {
        label: 'Manage footer',
        icon: 'links',
        items: [
          { label: 'Footer link group', href: '/admin-panel/footer-link-groups', id: 'footer-link-groups', icon: 'collection' },
          { label: 'Footer link', href: '/admin-panel/footer-links', id: 'footer-links', icon: 'links' },
        ],
      },
    ],
  },
];

export default navConfig;
