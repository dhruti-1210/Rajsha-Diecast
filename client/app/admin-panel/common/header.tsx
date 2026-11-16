import type { ReactNode } from 'react';

type AdminHeaderProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  action?: ReactNode;
};

export default function Header({
  eyebrow,
  title,
  highlight,
  subtitle,
  action,
}: AdminHeaderProps) {
  return (
    <div className="admin-heading-row">
      <div>
        <p className="admin-eyebrow">{eyebrow}</p>
        <h1>{title} <span>{highlight}</span></h1>
        <p className="admin-subtitle">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
