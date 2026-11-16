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
  | 'logout';

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
