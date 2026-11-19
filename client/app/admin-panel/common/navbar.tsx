'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon, { type IconName } from './icon';
import navConfig, { type AdminView } from '../data/navConfig';

type NavbarProps = {
  activePage: AdminView;
  onNavigate: (page: AdminView) => void;
  onSignOut: () => void;
};

export default function Navbar({ activePage, onNavigate, onSignOut }: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    const activeGroup = navConfig
      .flatMap((section) => section.items)
      .find((item) => 'items' in item && item.items.some((child) => child.id === activePage));
    if (activeGroup && 'items' in activeGroup) setExpandedGroup(activeGroup.label);
  }, [activePage]);

  function navigate(page: AdminView) {
    onNavigate(page);
    setSidebarOpen(false);
  }

  function renderLink(item: {
    label: string;
    href: string;
    id: AdminView;
    icon: IconName;
  }, nested = false) {
    return (
      <a
        className={`admin-nav-item${nested ? ' admin-nav-subitem' : ''} ${activePage === item.id ? 'admin-nav-active' : ''}`}
        href={item.href}
        aria-current={activePage === item.id ? 'page' : undefined}
        key={item.id}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          if (window.location.hash !== item.href) window.history.pushState(null, '', item.href);
          navigate(item.id);
        }}
      >
        <Icon name={item.icon} /> <span>{item.label}</span>
      </a>
    );
  }

  return (
    <>
      <header className={`admin-mobile-header d-lg-none${sidebarOpen ? ' admin-mobile-header-open' : ''}`}>
        <Link className={`admin-mobile-brand${sidebarOpen ? ' d-none' : ''}`} href="/" onClick={onSignOut} aria-label="Rajsha Diecast home">
          <Image src="/images/logo.png" alt="Rajsha Diecast" width={140} height={100} priority />
        </Link>
        <button
          type="button"
          className="admin-sidebar-toggle"
          aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={sidebarOpen}
          aria-controls="admin-sidebar"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          <Icon name={sidebarOpen ? 'close' : 'menu'} size={22} />
        </button>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-scrim"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside id="admin-sidebar" className={`admin-sidebar${sidebarOpen ? ' admin-sidebar-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link className="admin-brand" href="/" onClick={onSignOut} aria-label="Rajsha Diecast home">
            <Image src="/images/logo.png" alt="Rajsha Diecast" width={140} height={100} priority />
          </Link>
          <button
            type="button"
            className="admin-sidebar-close"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {navConfig.flatMap((section) =>
            section.items.map((item) => {
              if (!('items' in item)) return renderLink(item);

              return (
                <div className="admin-nav-group" key={item.label}>
                  <button
                    type="button"
                    className={`admin-nav-group-toggle${item.items.some((child) => child.id === activePage) ? ' admin-nav-group-active' : ''}`}
                    aria-expanded={expandedGroup === item.label}
                    onClick={() => setExpandedGroup((current) => current === item.label ? null : item.label)}
                  >
                    <Icon name={item.icon} />
                    <span>{item.label}</span>
                    <Icon name="chevron" size={15} />
                  </button>
                  {expandedGroup === item.label && (
                    <div className="admin-nav-submenu">
                      {item.items.map((child) => renderLink(child, true))}
                    </div>
                  )}
                </div>
              );
            }),
          )}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-avatar">RD</span>
          <span><strong>Store admin</strong><small>Rajsha Diecast</small></span>
          <button type="button" className="admin-logout" onClick={onSignOut} aria-label="Sign out" title="Sign out">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
