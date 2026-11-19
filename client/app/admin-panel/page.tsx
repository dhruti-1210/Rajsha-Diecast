'use client';

import { useEffect, useState } from 'react';
import navConfig, { type AdminView } from './data/navConfig';
import Navbar from './common/navbar';
import {
  hasAdminSession,
  signOutAdmin,
} from './middleware/authmiddleware';
import AdminLoginPage from './pages/AdminLoginPage';
import DashboardPage from './pages/DashboardPage';
import InventoryPage from './pages/InventoryPage';
import CollectionTypesPage from './pages/CollectionTypes';
import PackagingTypePage from './pages/PackagingType';
import ScaleSizesPage from './pages/scaleSize';
import CompanySetupPage from './pages/companysetup';
import BannerPage from './pages/banner';
import CmsPage from './pages/cms';
import CheckoutPage from './pages/checkout';
import BrandMasterPage from './pages/brandMaster';
import ReviewMasterPage from './pages/reviewMaster';
import FooterLinkGroupPage from './pages/FooterLinkGroup';
import FooterLinkPage from './pages/FooterLink';
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
        .flatMap((section) => section.items.flatMap((item) => 'items' in item ? item.items : [item]))
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
    <main className="admin-dashboard container-fluid p-0">
      <Navbar
        activePage={activePage}
        onNavigate={setActivePage}
        onSignOut={signOut}
      />
      <section className="admin-workspace container-fluid p-0">
        <div className="admin-content container-fluid">
          {authError && <div className="admin-notice admin-notice-error" role="alert">{authError}</div>}
          {activePage === 'inventory'
            ? <InventoryPage />
            : activePage === 'brands'
              ? <BrandMasterPage />
            : activePage === 'collection-types'
              ? <CollectionTypesPage />
              : activePage === 'packaging-types'
                ? <PackagingTypePage />
                : activePage === 'scale-sizes'
                  ? <ScaleSizesPage />
                  : activePage === 'company-setup'
                    ? <CompanySetupPage />
                    : activePage === 'banners'
                      ? <BannerPage />
                      : activePage === 'cms'
                        ? <CmsPage />
                        : activePage === 'checkout'
                          ? <CheckoutPage />
                          : activePage === 'review-master'
                            ? <ReviewMasterPage />
                            : activePage === 'footer-link-groups'
                              ? <FooterLinkGroupPage />
                              : activePage === 'footer-links'
                                ? <FooterLinkPage />
                    : <DashboardPage />}
        </div>
      </section>
    </main>
  );
}
