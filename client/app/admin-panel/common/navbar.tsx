'use client';

import Image from 'next/image';
import Link from 'next/link';
import Icon from './icon';
import navConfig, { type AdminView } from '../data/navConfig';

type NavbarProps = {
  activePage: AdminView;
  onNavigate: (page: AdminView) => void;
  onSignOut: () => void;
};

export default function Navbar({ activePage, onNavigate, onSignOut }: NavbarProps) {
  return (
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/" onClick={onSignOut} aria-label="Rajsha Diecast home">
        <Image src="/images/logo.png" alt="Rajsha Diecast" width={140} height={100} priority />
      </Link>
      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {navConfig.map((section) => (
          <div key={section.title}>
            <p className="admin-nav-label">{section.title}</p>
            {section.items.map((item) => (
              <a
                className={`admin-nav-item ${activePage === item.id ? 'admin-nav-active' : ''}`}
                href={item.href}
                aria-current={activePage === item.id ? 'page' : undefined}
                key={item.id}
                onClick={(event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                  event.preventDefault();
                  if (window.location.hash !== item.href) {
                    window.history.pushState(null, '', item.href);
                  }
                  onNavigate(item.id);
                }}
              >
                <Icon name={item.icon} /> {item.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="admin-sidebar-bottom">
        <span className="admin-avatar">RD</span>
        <span><strong>Store admin</strong><small>Rajsha Diecast</small></span>
        <button type="button" className="admin-logout" onClick={onSignOut} aria-label="Sign out" title="Sign out">
          <Icon name="logout" size={16} />
        </button>
      </div>
    </aside>
  );
}
