'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon from './common/icon';
import navConfig, { type AdminView } from './data/navConfig';
import {
  hasAdminSession,
  signOutAdmin,
} from './middleware/authmiddleware';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import CollectionTypesPage from './pages/CollectionTypes';
import PackagingTypePage from './pages/PackagingType';
import './admin-panel.css';

export default function AdminPanelPage() {
  const [activePage, setActivePage] = useState<AdminView>('dashboard');
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    try {
      setAuthenticated(hasAdminSession());
    } catch {
      setAuthError('Could not check the demo session. Check your browser storage settings.');
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const syncPage = () => {
      const currentPage = navConfig
        .flatMap((section) => section.items)
        .find((item) => item.href === window.location.hash);
      setActivePage(currentPage?.id ?? 'dashboard');
    };

    syncPage();
    window.addEventListener('hashchange', syncPage);
    window.addEventListener('popstate', syncPage);
    return () => {
      window.removeEventListener('hashchange', syncPage);
      window.removeEventListener('popstate', syncPage);
    };
  }, []);

  function signOut() {
    try {
      signOutAdmin();
    } catch {
      setAuthError('Could not end the demo session. Check your browser storage settings.');
      return;
    }
    setAuthError('');
    window.history.replaceState(null, '', '/admin-panel');
    setActivePage('dashboard');
    setAuthenticated(false);
  }

  if (!authChecked) {
    return (
      <main className="admin-login-screen" aria-label="Loading admin session">
        <p className="admin-auth-loading">Checking admin access…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <AdminLoginPage
        onAuthenticated={() => {
          window.history.replaceState(null, '', '/admin-panel');
          setActivePage('dashboard');
          setAuthenticated(true);
        }}
        sessionError={authError}
      />
    );
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/" onClick={signOut} aria-label="Rajsha Diecast home">
          <Image src="/images/logo.png" alt="Rajsha Diecast" width={140} height={100} priority />
        </Link>
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
                  setActivePage(item.id);
                }}
              >
                <Icon name={item.icon} /> {item.label}
              </a>
            ))}
          </div>
        ))}
        <div className="admin-sidebar-bottom">
          <span className="admin-avatar">RD</span>
          <span><strong>Store admin</strong><small>Rajsha Diecast</small></span>
          <button type="button" className="admin-logout" onClick={signOut} aria-label="Sign out" title="Sign out">
            <Icon name="logout" size={16} />
          </button>
        </div>
      </aside>
      <section className="admin-workspace">
        <div className="admin-content">
          {authError && <div className="admin-notice admin-notice-error" role="alert">{authError}</div>}
          {activePage === 'inventory'
            ? <InventoryPage />
            : activePage === 'collection-types'
              ? <CollectionTypesPage />
              : activePage === 'packaging-types'
                ? <PackagingTypePage />
                : <DashboardPage />}
        </div>
      </section>
    </main>
  );
}
