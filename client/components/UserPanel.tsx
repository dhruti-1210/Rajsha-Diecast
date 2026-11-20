'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useToastify } from '@/components/Toastify';
import ConfirmDialog from '@/components/ConfirmDialog';
import { createReview, getMyReviews } from '@/api/ReviewsApi';
import { getMyOrders, MY_ORDERS_UPDATED_EVENT } from '@/api/orderMasterApi';
import type { Review } from '@/types/Reviews';
import type { OrderMaster } from '@/types/orderMaster';
import { userAuthUrl } from '@/lib/user-auth';
import OrderPage from '@/app/user-panel/order';

type PanelSection = 'dashboard' | 'profile' | 'orders' | 'reviews';
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
  { id: 'reviews', label: 'Reviews', icon: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z' },
];

function isPanelSection(section: string | null): section is PanelSection {
  return sections.some((item) => item.id === section);
}

function getPanelSectionFromUrl(): PanelSection {
  const requestedSection = new URLSearchParams(window.location.search).get('section');
  return isPanelSection(requestedSection) ? requestedSection : 'profile';
}

function updatePanelSectionUrl(section: PanelSection) {
  const url = new URL(window.location.href);
  if (section === 'profile') {
    url.searchParams.delete('section');
  } else {
    url.searchParams.set('section', section);
  }
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

export default function UserPanel() {
  const [activeSection, setActiveSection] = useState<PanelSection>('profile');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({ fullName: '', email: '', phone: '', address: '' });
  const [profileComplete, setProfileComplete] = useState(false);
  const [ready, setReady] = useState(false);
  const [orders, setOrders] = useState<OrderMaster[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
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
        const requestedSection = getPanelSectionFromUrl();
        const section = !user.profileComplete && requestedSection !== 'profile'
          ? 'profile'
          : requestedSection;
        setActiveSection(section);
        if (section !== requestedSection) updatePanelSectionUrl(section);
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

  useEffect(() => {
    if (!ready) return;
    let active = true;

    async function loadOrders() {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const response = await getMyOrders();
        if (!response.success) {
          throw new Error(response.message || 'Could not load your orders.');
        }
        if (active) setOrders(response.data);
      } catch (error) {
        if (active) {
          setOrdersError(error instanceof Error ? error.message : 'Could not load your orders.');
        }
      } finally {
        if (active) setOrdersLoading(false);
      }
    }

    void loadOrders();
    window.addEventListener(MY_ORDERS_UPDATED_EVENT, loadOrders);
    return () => {
      active = false;
      window.removeEventListener(MY_ORDERS_UPDATED_EVENT, loadOrders);
    };
  }, [ready]);

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

  function navigateToSection(section: PanelSection) {
    if (!profileComplete && section !== 'profile') {
      notify('error', 'Complete your profile before continuing.');
      return;
    }
    setActiveSection(section);
    updatePanelSectionUrl(section);
    setMobileSidebarOpen(false);
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
                onClick={() => navigateToSection(section.id)}
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
          {activeSection === 'dashboard' && (
            <Dashboard
              orders={orders}
              ordersLoading={ordersLoading}
              ordersError={ordersError}
              onOrdersClick={() => navigateToSection('orders')}
            />
          )}
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
          {activeSection === 'orders' && (
            <OrderPage orders={orders} loading={ordersLoading} error={ordersError} />
          )}
          {activeSection === 'reviews' && <ReviewsPage />}
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

function Dashboard({
  orders,
  ordersLoading,
  ordersError,
  onOrdersClick,
}: {
  orders: OrderMaster[];
  ordersLoading: boolean;
  ordersError: string;
  onOrdersClick: () => void;
}) {
  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading">
        <div><h2>Dashboard</h2></div>
      </div>
      <div className="user-panel-stats">
        <article className="user-panel-stat"><small>ORDERS PLACED</small><strong>{ordersLoading ? '…' : String(orders.length).padStart(2, '0')}</strong><span>Across your garage</span></article>
        <article className="user-panel-stat"><small>COLLECTOR STATUS</small><strong className="user-panel-gold">Gold</strong><span>Thank you for collecting</span></article>
      </div>
      <OrderPage
        orders={orders}
        loading={ordersLoading}
        error={ordersError}
        compact
        onViewAll={onOrdersClick}
      />
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

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewNotice, setReviewNotice] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        const response = await getMyReviews();
        if (!response.success) {
          throw new Error(response.message || 'Could not load your reviews.');
        }
        if (active) setReviews(response.data);
      } catch (error) {
        if (active) {
          setReviewError(error instanceof Error ? error.message : 'Could not load your reviews.');
        }
      } finally {
        if (active) setLoadingReviews(false);
      }
    }

    void loadReviews();
    return () => { active = false; };
  }, []);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = reviewMessage.trim();
    if (!message) {
      setReviewError('Enter a review before submitting.');
      return;
    }

    setSubmittingReview(true);
    setReviewError('');
    setReviewNotice('');
    try {
      const response = await createReview({ message });
      if (!response.success) {
        throw new Error(response.message || 'Could not submit your review.');
      }
      setReviews((current) => [response.data, ...current]);
      setReviewMessage('');
      setReviewNotice('Your review is now visible in the reviews section.');
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'Could not submit your review.');
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="user-panel-section">
      <div className="user-panel-section-heading"><div><h2>Reviews</h2></div></div>
      <section className="user-panel-card user-panel-review-card">
        <div>
          <p className="eyebrow">YOUR FEEDBACK</p>
          <h3>Leave a review</h3>
          <p>Share your experience with the Rajsha Diecast team.</p>
        </div>
        <form onSubmit={(event) => void submitReview(event)}>
          <label className="user-panel-review-field" htmlFor="order-review">
            <span>Review message</span>
            <textarea
              id="order-review"
              name="review"
              value={reviewMessage}
              onChange={(event) => setReviewMessage(event.target.value)}
              maxLength={2000}
              rows={5}
              required
            />
          </label>
          {reviewError && <p className="user-panel-review-feedback error" role="alert">{reviewError}</p>}
          {reviewNotice && <p className="user-panel-review-feedback" role="status">{reviewNotice}</p>}
          <div className="user-panel-review-actions">
            <button className="btn" type="submit" disabled={submittingReview}>
              {submittingReview ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>
      </section>
      <section className="user-panel-card user-panel-review-list-card" aria-label="Your submitted reviews">
        <div className="user-panel-card-heading">
          <div><p className="eyebrow">YOUR SUBMISSIONS</p><h3>Submitted reviews</h3></div>
        </div>
        {loadingReviews && <p role="status">Loading your reviews…</p>}
        {!loadingReviews && reviews.length === 0 && !reviewError && (
          <p className="user-panel-review-empty">You haven’t submitted a review yet.</p>
        )}
        {reviews.map((review) => (
          <article className="user-panel-review-item" key={review._id}>
            <p>{review.message}</p>
            <small>
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently submitted'}
              {' · '}
              {review.isActive && review.isDisplay ? 'Visible on site' : 'Not visible on site'}
            </small>
          </article>
        ))}
      </section>
    </div>
  );
}
