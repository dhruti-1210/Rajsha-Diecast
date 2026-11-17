'use client';

import { useEffect, useMemo, useState } from 'react';
import { getCheckoutList, updateCheckoutStatus } from '../api/checkout';
import type { Checkout, CheckoutStage } from '../types/checkout';
import Header from '../common/header';
import Icon from '../common/icon';

const checkoutStages: { value: CheckoutStage; label: string }[] = [
  { value: 'isPLACED', label: 'Placed' },
  { value: 'isPROCESSING', label: 'Processing' },
  { value: 'isSHIPPED', label: 'Shipped' },
  { value: 'isTransist', label: 'In transit' },
  { value: 'isDELIVERED', label: 'Delivered' },
];

function getCheckoutStage(checkout: Checkout): CheckoutStage | '' {
  for (let index = checkoutStages.length - 1; index >= 0; index -= 1) {
    const stage = checkoutStages[index].value;
    if (checkout[stage]) return stage;
  }
  return '';
}

function getOrder(checkout: Checkout) {
  return typeof checkout.order_Master_id === 'object'
    ? checkout.order_Master_id
    : null;
}

function getOrderId(checkout: Checkout) {
  const order = getOrder(checkout);
  return order?._id ?? (typeof checkout.order_Master_id === 'string' ? checkout.order_Master_id : '—');
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

function formatTotal(value?: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
    : '—';
}

export default function CheckoutPage() {
  const [items, setItems] = useState<Checkout[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(() => new Set());
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getCheckoutList();
        if (active) setItems(response.data);
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load checkout records.');
          setNoticeIsError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((checkout) => {
      const order = getOrder(checkout);
      return [
        getOrderId(checkout),
        order?.TrackingId,
        order?.PaymentStatus,
        getCheckoutStage(checkout),
      ].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [items, query]);

  async function changeStatus(checkout: Checkout, status: CheckoutStage) {
    setUpdatingIds((current) => new Set(current).add(checkout._id));
    try {
      const response = await updateCheckoutStatus(checkout._id, status, 'admin');
      setItems((current) => current.map((item) => (
        item._id === checkout._id ? response.data : item
      )));
      const stage = checkoutStages.find((item) => item.value === status);
      setNotice(`Order status updated to ${stage?.label ?? status}.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update order status.');
      setNoticeIsError(true);
    } finally {
      setUpdatingIds((current) => {
        const next = new Set(current);
        next.delete(checkout._id);
        return next;
      });
    }
  }

  return (
    <>
      <Header
        eyebrow="ORDER MANAGEMENT"
        title="Checkout"
        highlight="orders"
        subtitle="Review checkout records and update order fulfillment progress."
      />

      {notice && (
        <div className={`admin-notice ${noticeIsError ? 'admin-notice-error' : ''}`} role={noticeIsError ? 'alert' : 'status'}>
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Checkout orders</h2>
            <p>Update an order through placed, processing, shipping, and delivery.</p>
          </div>
          <span className="admin-inventory-count">{items.length} total</span>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'order' : 'orders'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search order, tracking, or payment..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search checkout orders"
            />
          </label>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table admin-reference-table">
            <thead>
              <tr>
                <th>ORDER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAYMENT</th>
                <th>TRACKING</th>
                <th>FULFILLMENT</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((checkout) => {
                const order = getOrder(checkout);
                const currentStage = getCheckoutStage(checkout);
                const updating = updatingIds.has(checkout._id);
                return (
                  <tr key={checkout._id}>
                    <td><strong className="admin-reference-name">{getOrderId(checkout)}</strong></td>
                    <td>{formatDate(checkout.createdAt)}</td>
                    <td>{formatTotal(order?.Total)}</td>
                    <td>{order?.PaymentStatus ?? '—'}</td>
                    <td>{order?.TrackingId || '—'}</td>
                    <td>
                      <select
                        className="admin-checkout-status-select"
                        value={currentStage}
                        disabled={updating}
                        aria-label={`Update fulfillment status for order ${getOrderId(checkout)}`}
                        onChange={(event) => {
                          const selectedStage = checkoutStages.find((stage) => stage.value === event.target.value);
                          if (selectedStage) void changeStatus(checkout, selectedStage.value);
                        }}
                      >
                        <option value="">Not started</option>
                        {checkoutStages.map((stage) => (
                          <option key={stage.value} value={stage.value}>{stage.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {visibleItems.length === 0 && !loading && (
                <tr>
                  <td className="admin-reference-empty" colSpan={6}>
                    {items.length ? 'No checkout orders match your search.' : 'No checkout orders found.'}
                  </td>
                </tr>
              )}
              {loading && (
                <tr><td className="admin-reference-empty" colSpan={6}>Loading checkout orders…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
