'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useToastify } from '@/components/Toastify';
import ConfirmDialog from '@/components/ConfirmDialog';
import { money } from '@/lib/format';
import { userAuthUrl } from '@/lib/user-auth';

type PanelSection = 'dashboard' | 'profile' | 'orders';
type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

const sections: { id: PanelSection; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 14h7v7H3z' },
  { id: 'profile', label: 'User profile', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0' },
  { id: 'orders', label: 'Orders', icon: 'M3 7h18v14H3z M7 7V4h10v3 M3 11h18 M10 11v3h4v-3' },
];

const orders = [
  { id: 'RD-2048', name: 'Nissan GT-R (R35) Nismo', date: '12 Nov 2026', price: 1199, status: 'Delivered' },
  { id: 'RD-1936', name: 'Porsche 911 GT3 R', date: '28 Oct 2026', price: 1899, status: 'In transit' },
  { id: 'RD-1802', name: 'Toyota GR86', date: '06 Oct 2026', price: 1099, status: 'Delivered' },
];

export default function UserPanel() {
  const [activeSection, setActiveSection] = useState<PanelSection>('profile');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({ fullName: '', email: '', phone: '', address: '' });
  const [profileComplete, setProfileComplete] = useState(false);
  const [ready, setReady] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'logout' | 'delete' | null>(null);
  const { setAuthStatus } = useStore();
  const { notify } = useToastify();
  const router = useRouter();

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileSidebarOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    let active = true;
    async function loadSession() {
      try {
        const response = await fetch(userAuthUrl('session'), { credentials: 'include' });
        const result = await response.json();
        if (response.status === 401) {
          setAuthStatus('unauthenticated');
          router.replace('/login');
          return;
        }
        if (!response.ok) {
          throw new Error(result.message || 'Could not verify your login session.');
        }

        const user = result.data.user;
        if (!active) return;
        setAuthStatus('authenticated');
        setProfile((current) => ({
          ...current,
          fullName: user.name,
          email: user.email,
          phone: user.mobile,
          address: user.address,
        }));
        setProfileComplete(user.profileComplete);
        setReady(true);
      } catch (error) {
        if (!active) return;
        notify('error', error instanceof Error ? error.message : 'Could not verify your login session.');
        router.replace('/login');
      }
    }

    void loadSession();
    return () => { active = false; };
  }, [notify, router, setAuthStatus]);

  async function logout() {
    try {
      const response = await fetch(userAuthUrl('logout'), {
        method: 'POST',
        credentials: 'include',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Could not log out.');
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Could not log out.');
      setConfirmAction(null);
      return;
    }
    sessionStorage.removeItem('rajsha.userEmail');
    setAuthStatus('unauthenticated');
    setConfirmAction(null);
    notify('success', 'Logout successful. See you again soon!');
    router.push('/login');
  }

  if (!ready) {
    return (
      <main className="user-panel-page user-panel-loading" role="status" aria-live="polite">
        <div className="user-panel-loader">
          <span className="user-panel-loader-spinner" aria-hidden="true" />
          <p>Loading your profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="user-panel-page">
      <div className="user-panel-layout">
        <button
          type="button"
          className="user-panel-sidebar-toggle"
          aria-expanded={mobileSidebarOpen}
          aria-controls="user-panel-sidebar"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          <span>Account menu</span>
        </button>
        {mobileSidebarOpen && (
          <button
            type="button"
            className="user-panel-sidebar-backdrop"
            aria-label="Close account menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <aside id="user-panel-sidebar" className={`user-panel-sidebar${mobileSidebarOpen ? ' is-open' : ''}`}>
          <div className="user-panel-sidebar-heading">
            <p className="user-panel-nav-label">YOUR GARAGE</p>
            <button type="button" className="user-panel-sidebar-close" aria-label="Close account menu" onClick={() => setMobileSidebarOpen(false)}>×</button>
          </div>
          <nav className="user-panel-nav" aria-label="User panel">
            {sections.map((section) => (
              <button
                type="button"
                key={section.id}
                className={activeSection === section.id ? 'active' : ''}
                aria-current={activeSection === section.id ? 'page' : undefined}
                onClick={() => {
                  if (!profileComplete && section.id !== 'profile') {
                    notify('error', 'Complete your profile before continuing.');
                    return;
                  }
                  setActiveSection(section.id);
                  setMobileSidebarOpen(false);
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={section.icon} /></svg>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
          <div className="user-panel-sidebar-footer">
            <button type="button" className="user-panel-logout" onClick={() => {
              setMobileSidebarOpen(false);
              setConfirmAction('logout');
            }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5 M15 12H3 M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></svg>
              <span>Logout</span>
            </button>

            <button type="button" className="user-panel-delete" onClick={() => {
              setMobileSidebarOpen(false);
              setConfirmAction('delete');
            }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5" /></svg>
              <span>Delete account</span>
            </button>
            <small>RAJSHA DIECAST · MEMBER</small>
          </div>
        </aside>

        <section className="user-panel-content" aria-live="polite">
          {activeSection === 'dashboard' && <Dashboard onOrdersClick={() => setActiveSection('orders')} />}
          {activeSection === 'profile' && (
            <Profile
              profile={profile}
              requiredForAccess={!profileComplete}
              onSave={async (updatedProfile) => {
                const response = await fetch(userAuthUrl('profile'), {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({
                    name: updatedProfile.fullName,
                    mobile: updatedProfile.phone,
                    address: updatedProfile.address,
                  }),
                });
                const result = await response.json();
                if (!response.ok) {
                  throw new Error(result.message || 'Could not save your profile.');
                }
                const user = result.data.user;
                setProfile((current) => ({
                  ...current,
                  fullName: user.name,
                  email: user.email,
                  phone: user.mobile,
                  address: user.address,
                }));
                setProfileComplete(user.profileComplete);
                notify('success', 'Profile details saved.');
              }}
            />
          )}
          {activeSection === 'orders' && <Orders />}
        </section>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        title={confirmAction === 'delete' ? 'Delete your account?' : 'Leaving the garage?'}
        message={confirmAction === 'delete'
          ? 'Are you sure you want to delete your account? This preview will not delete your account.'
          : 'Are you sure you want to log out of your account?'}
        confirmLabel={confirmAction === 'delete' ? 'Got it' : 'Yes, log out'}
        cancelLabel={confirmAction === 'delete' ? 'Cancel' : 'Stay logged in'}
        onConfirm={() => {
          if (confirmAction === 'delete') {
            setConfirmAction(null);
            return;
          }
          void logout();
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </main>
  );
}

function Dashboard({ onOrdersClick }: { onOrdersClick: () => void }) {
  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading">
        <div><h2>Dashboard</h2></div>
      </div>
      <div className="user-panel-stats">
        <article className="user-panel-stat"><small>ORDERS PLACED</small><strong>03</strong><span>Across your garage</span></article>
        <article className="user-panel-stat"><small>COLLECTOR STATUS</small><strong className="user-panel-gold">Gold</strong><span>Thank you for collecting</span></article>
      </div>
      <section className="user-panel-card">
        <div className="user-panel-card-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Recent orders</h3></div><button type="button" onClick={onOrdersClick}>View all orders <span aria-hidden="true">→</span></button></div>
        <div className="user-panel-order-list">
          {orders.slice(0, 2).map((order) => <OrderRow key={order.id} order={order} />)}
        </div>
      </section>
      <div className="user-panel-note"><span aria-hidden="true">✦</span><p>Your next favourite model is waiting in the collection.</p><Link href="/shop">Shop all models →</Link></div>
    </div>
  );
}

function Profile({
  profile,
  requiredForAccess,
  onSave,
}: {
  profile: ProfileData;
  requiredForAccess: boolean;
  onSave: (profile: ProfileData) => Promise<void>;
}) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  function updateField(field: keyof ProfileData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading">
        <div>
          <h2>User profile</h2>
          {requiredForAccess && <p role="status">Complete your profile to access your garage.</p>}
        </div>
      </div>
      <section className="user-panel-card user-panel-profile-card">
        <div className="user-panel-profile-banner"><div><small>COLLECTOR PROFILE</small><h3>{form.fullName || 'Your profile'}</h3><span>Update your details below</span></div></div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSaveError('');
            setSaving(true);
            void onSave(form)
              .catch((error: unknown) => {
                setSaveError(error instanceof Error ? error.message : 'Could not save your profile.');
              })
              .finally(() => setSaving(false));
          }}
        >
          <div className="user-panel-profile-grid">
            <ProfileField label="Full name" name="fullName" value={form.fullName} onChange={updateField} required />
            <ProfileField label="Email address" name="email" type="email" value={form.email} onChange={updateField} required disabled />
            <ProfileField label="Phone number" name="phone" type="tel" value={form.phone} onChange={updateField} required />
            <ProfileField label="Default address" name="address" value={form.address} onChange={updateField} />
          </div>
          {saveError && <p role="alert">{saveError}</p>}
          <div className="user-panel-profile-actions">
            <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ProfileField({
  label,
  name,
  value,
  type = 'text',
  required = false,
  disabled = false,
  onChange,
}: {
  label: string;
  name: keyof ProfileData;
  value: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (field: keyof ProfileData, value: string) => void;
}) {
  return (
    <label className="user-panel-profile-field">
      <small>{label}</small>
      <input
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(name, event.target.value)}
        required={required}
      />
    </label>
  );
}

function Orders() {
  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading"><div><h2>Orders</h2></div></div>
      <section className="user-panel-card">
        <div className="user-panel-order-list">
          {orders.map((order) => <OrderRow key={order.id} order={order} />)}
        </div>
      </section>
    </div>
  );
}

function OrderRow({ order }: { order: typeof orders[number] }) {
  const delivered = order.status === 'Delivered';
  return (
    <article className="user-panel-order-row">
      <span className="user-panel-order-art" aria-hidden="true">RD</span>
      <div className="user-panel-order-product"><strong>{order.name}</strong><small>Order #{order.id} · {order.date}</small></div>
      <span className={`user-panel-order-status${delivered ? ' delivered' : ''}`}><i />{order.status}</span>
      <strong className="user-panel-order-price">{money(order.price)}</strong>
    </article>
  );
}
