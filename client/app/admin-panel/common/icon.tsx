export type IconName =
  | 'box'
  | 'car'
  | 'tag'
  | 'cart'
  | 'plus'
  | 'search'
  | 'edit'
  | 'trash'
  | 'close'
  | 'logout'
  | 'building'
  | 'image'
  | 'file'
  | 'star'
  | 'links'
  | 'collection'
  | 'ruler'
  | 'menu'
  | 'chevron';

const iconPaths: Record<IconName, string[]> = {
  box: [
    'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z',
    'm3.3 7 8.7 5 8.7-5',
    'M12 22V12',
  ],
  car: [
    'M5 17h14l1.5-4.5a2 2 0 0 0-1.9-2.5H5.4a2 2 0 0 0-1.9 2.5L5 17Z',
    'm5.5 10 2-4h9l2 4',
    'M5 17v2',
    'M19 17v2',
    'M7 14h.01',
    'M17 14h.01',
  ],
  tag: [
    'M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4a1 1 0 0 0-1 1v5.59A2 2 0 0 0 3.59 11l9.58 9.59a2 2 0 0 0 2.83 0l4.59-4.59a2 2 0 0 0 0-2.59Z',
    'M7 7h.01',
  ],
  cart: [
    'M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6',
    'M10 21h.01',
    'M18 21h.01',
  ],
  plus: ['M12 5v14', 'M5 12h14'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z', 'm21 21-4.35-4.35'],
  edit: ['M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'm19 6-1 14H6L5 6', 'M10 11v5', 'M14 11v5'],
  close: ['M18 6 6 18', 'm6 6 12 12'],
  logout: ['M10 17l5-5-5-5', 'M15 12H3', 'M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7'],
  building: ['M3 21h18', 'M5 21V5l7-3v19', 'M19 21V9l-7-4', 'M9 8h.01', 'M9 12h.01', 'M9 16h.01', 'M15 12h.01', 'M15 16h.01'],
  image: ['M4 4h16v16H4z', 'm4 15 5-5 4 4 3-3 4 4', 'M9 9h.01'],
  file: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8'],
  star: ['m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z'],
  links: ['M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7', 'M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7'],
  collection: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  ruler: ['M21.3 8.7 15.3 2.7a1 1 0 0 0-1.4 0L2.7 13.9a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0L21.3 10a1 1 0 0 0 0-1.3Z', 'm7.5 10.5 2 2', 'm10.5 7.5 2 2', 'm13.5 4.5 2 2'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  chevron: ['m6 9 6 6 6-6'],
};

export default function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      {iconPaths[name].map((path) => <path key={path} d={path} />)}
    </svg>
  );
}
