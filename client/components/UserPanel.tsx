'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useToastify } from '@/components/Toastify';
import ConfirmDialog from '@/components/ConfirmDialog';
import CarImage from '@/components/CarImage';
import { money } from '@/lib/format';

type PanelSection = 'dashboard' | 'profile' | 'orders' | 'wishlist';
type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  photoUrl: string;
};

const sections: { id: PanelSection; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'M3 3h7v7H3z M14 3h7v5h-7z M14 12h7v9h-7z M3 14h7v7H3z' },
  { id: 'profile', label: 'User profile', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0' },
  { id: 'orders', label: 'Orders', icon: 'M3 7h18v14H3z M7 7V4h10v3 M3 11h18 M10 11v3h4v-3' },
  { id: 'wishlist', label: 'Wishlist', icon: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z' },
];

const orders = [
  { id: 'RD-2048', name: 'Nissan GT-R (R35) Nismo', date: '12 Nov 2026', price: 1199, status: 'Delivered' },
  { id: 'RD-1936', name: 'Porsche 911 GT3 R', date: '28 Oct 2026', price: 1899, status: 'In transit' },
  { id: 'RD-1802', name: 'Toyota GR86', date: '06 Oct 2026', price: 1099, status: 'Delivered' },
];

export default function UserPanel() {
  const [activeSection, setActiveSection] = useState<PanelSection>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({ fullName: '', email: '', phone: '', address: '', photoUrl: '' });
  const [ready, setReady] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const { wishlist } = useStore();
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
    const savedEmail = sessionStorage.getItem('rajsha.userEmail');
    if (!savedEmail) {
      router.replace('/login');
      return;
    }
    setProfile((current) => ({ ...current, email: savedEmail }));
    setReady(true);
  }, [router]);

  function logout() {
    sessionStorage.removeItem('rajsha.userEmail');
    setConfirmLogout(false);
    notify('success', 'Logout successful. See you again soon!');
    router.push('/login');
  }

  function updateProfilePhoto(file: File) {
    if (!file.type.startsWith('image/')) {
      notify('error', 'Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const photoUrl = reader.result;
      if (typeof photoUrl !== 'string') {
        notify('error', 'Could not load that profile photo.');
        return;
      }
      setProfile((current) => ({ ...current, photoUrl }));
      notify('success', 'Profile photo updated.');
    };
    reader.onerror = () => notify('error', 'Could not load that profile photo.');
    reader.readAsDataURL(file);
  }

  if (!ready) return null;

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
                  setActiveSection(section.id);
                  setMobileSidebarOpen(false);
                }}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={section.icon} /></svg>
                <span>{section.label}</span>
                {section.id === 'wishlist' && <small>{wishlist.length}</small>}
              </button>
            ))}
          </nav>
          <div className="user-panel-sidebar-footer">
            <button type="button" className="user-panel-logout" onClick={() => {
              setMobileSidebarOpen(false);
              setConfirmLogout(true);
            }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5 M15 12H3 M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></svg>
              <span>Logout</span>
            </button>
            <small>RAJSHA DIECAST · MEMBER</small>
          </div>
        </aside>

        <section className="user-panel-content" aria-live="polite">
          {activeSection === 'dashboard' && <Dashboard wishlistCount={wishlist.length} onOrdersClick={() => setActiveSection('orders')} />}
          {activeSection === 'profile' && (
            <Profile
              profile={profile}
              onPhotoChange={updateProfilePhoto}
              onSave={(updatedProfile) => {
                setProfile((current) => ({ ...updatedProfile, photoUrl: current.photoUrl }));
                notify('success', 'Profile details saved.');
              }}
            />
          )}
          {activeSection === 'orders' && <Orders />}
          {activeSection === 'wishlist' && <Wishlist />}
        </section>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        title="Leaving the garage?"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Yes, log out"
        cancelLabel="Stay logged in"
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
      />
    </main>
  );
}

function Dashboard({ wishlistCount, onOrdersClick }: { wishlistCount: number; onOrdersClick: () => void }) {
  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading">
        <div><h2>Dashboard</h2></div>
      </div>
      <div className="user-panel-stats">
        <article className="user-panel-stat"><small>ORDERS PLACED</small><strong>03</strong><span>Across your garage</span></article>
        <article className="user-panel-stat"><small>WISHLIST MODELS</small><strong>{String(wishlistCount).padStart(2, '0')}</strong><span>Saved for later</span></article>
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
  onPhotoChange,
  onSave,
}: {
  profile: ProfileData;
  onPhotoChange: (file: File) => void;
  onSave: (profile: ProfileData) => void;
}) {
  const [form, setForm] = useState(profile);

  function updateField(field: keyof ProfileData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading"><div><h2>User profile</h2></div></div>
      <section className="user-panel-card user-panel-profile-card">
        <div className="user-panel-profile-banner"><ProfileAvatar photoUrl={profile.photoUrl} onUpload={onPhotoChange} large /><div><small>COLLECTOR PROFILE</small><h3>{form.fullName || 'Your profile'}</h3><span>Update your details below</span></div></div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave(form);
          }}
        >
          <div className="user-panel-profile-grid">
            <ProfileField label="Full name" name="fullName" value={form.fullName} onChange={updateField} required />
            <ProfileField label="Email address" name="email" type="email" value={form.email} onChange={updateField} required />
            <ProfileField label="Phone number" name="phone" type="tel" value={form.phone} onChange={updateField} />
            <ProfileField label="Default address" name="address" value={form.address} onChange={updateField} />
          </div>
          <div className="user-panel-profile-actions"><button className="btn" type="submit">Save changes</button></div>
        </form>
      </section>
    </div>
  );
}

function ProfileAvatar({
  photoUrl,
  onUpload,
  large = false,
}: {
  photoUrl: string;
  onUpload: (file: File) => void;
  large?: boolean;
}) {
  return (
    <label className={`user-panel-avatar user-panel-avatar-upload${large ? ' large' : ''}`}>
      {photoUrl ? <img src={photoUrl} alt="Profile" /> : <span aria-hidden="true">RC</span>}
      <span className="user-panel-avatar-edit" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>
      </span>
      <input
        type="file"
        accept="image/*"
        aria-label="Add or edit profile photo"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUpload(file);
          event.target.value = '';
        }}
      />
    </label>
  );
}

function ProfileField({
  label,
  name,
  value,
  type = 'text',
  required = false,
  onChange,
}: {
  label: string;
  name: keyof ProfileData;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (field: keyof ProfileData, value: string) => void;
}) {
  return (
    <label className="user-panel-profile-field">
      <small>{label}</small>
      <input
        name={name}
        type={type}
        value={value}
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

function Wishlist() {
  const { wishlist, removeFromWishlist } = useStore();
  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading"><div><h2>Wishlist</h2></div></div>
      {wishlist.length === 0
        ? <section className="user-panel-card user-panel-empty"><span aria-hidden="true">♡</span><h3>Your wishlist is waiting</h3><p>Save models from the collection and they will show up here.</p><Link className="btn" href="/shop">Explore models</Link></section>
        : <div className="user-panel-wishlist">
          {wishlist.map((product) => (
            <article className="user-panel-product" key={product.id}>
              <Link href={`/shop/${product.id}`} className="user-panel-product-image" aria-label={`View ${product.name}`}><CarImage p={product} /></Link>
              <div className="user-panel-product-info"><small>{product.brand.toUpperCase()} · {product.scale}</small><Link href={`/shop/${product.id}`}>{product.name}</Link><strong>{money(product.price)}</strong>
                <button type="button" onClick={() => removeFromWishlist(product.id)}>Remove from wishlist</button>
              </div>
            </article>
          ))}
        </div>}
    </div>
  );
}
