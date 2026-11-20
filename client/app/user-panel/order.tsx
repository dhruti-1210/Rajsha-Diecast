'use client';

import { useEffect, useState } from 'react';
import type { OrderMaster } from '@/types/orderMaster';
import { money } from '@/lib/format';

type OrderPageProps = {
  orders: OrderMaster[];
  loading: boolean;
  error: string;
  compact?: boolean;
  onViewAll?: () => void;
};

function getOrderStatus(order: OrderMaster) {
  if (order.checkout?.isDELIVERED) return 'Delivered';
  if (order.checkout?.isTransist) return 'In transit';
  if (order.checkout?.isSHIPPED) return 'Shipped';
  if (order.checkout?.isPROCESSING) return 'Processing';
  if (order.checkout?.isPLACED) return 'Placed';
  return order.PaymentStatus || 'Pending';
}

function getOrderDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? 'Date unavailable'
    : parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
}

function OrderRow({
  order,
  trackingOpen,
  onTrack,
}: {
  order: OrderMaster;
  trackingOpen: boolean;
  onTrack: () => void;
}) {
  const productNames = order.items
    .map((item) => typeof item.product_ID === 'object' && item.product_ID
      ? `${item.product_ID.Name}${item.Quantity && item.Quantity > 1 ? ` × ${item.Quantity}` : ''}`
      : '')
    .filter(Boolean);
  const orderName = productNames.length > 0
    ? productNames.join(', ')
    : 'Order details';

  return (
    <article className="user-panel-order-row">
      <span className="user-panel-order-art" aria-hidden="true">RD</span>
      <div className="user-panel-order-product">
        <strong>{orderName}</strong>
        <small>
          Order #{order._id.slice(-8).toUpperCase()} · {getOrderDate(order.createdAt)}
        </small>
      </div>
      <button
        type="button"
        className={`user-panel-track-button${trackingOpen ? ' is-active' : ''}`}
        aria-haspopup="dialog"
        aria-expanded={trackingOpen}
        onClick={onTrack}
      >
        Track
      </button>
      <strong className="user-panel-order-price">{money(order.Total)}</strong>
    </article>
  );
}

const trackingStages = [
  { label: 'Order placed', flag: 'isPLACED' },
  { label: 'Processing', flag: 'isPROCESSING' },
  { label: 'Shipped', flag: 'isSHIPPED' },
  { label: 'In transit', flag: 'isTransist' },
  { label: 'Delivered', flag: 'isDELIVERED' },
] as const;

function TrackingDialog({ order, onClose }: { order: OrderMaster; onClose: () => void }) {
  const activeStageIndex = trackingStages.reduce(
    (activeIndex, stage, index) => order.checkout?.[stage.flag] ? index : activeIndex,
    -1,
  );

  return (
    <div className="user-panel-tracking-overlay" onClick={onClose}>
      <section
        className="user-panel-tracking-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="user-panel-tracking-close"
          aria-label="Close tracking details"
          onClick={onClose}
        >
          ×
        </button>
        <p className="eyebrow">SHIPMENT TRACKING</p>
        <h3 id="tracking-dialog-title">Track your order</h3>
        <div className="user-panel-tracking-meta">
          <span>ORDER <strong>#{order._id.slice(-8).toUpperCase()}</strong></span>
          <span>TRACKING ID <strong>{order.TrackingId || 'Assigned when shipped'}</strong></span>
        </div>
        <ol className="user-panel-tracking-steps" aria-label="Order tracking progress">
          {trackingStages.map((stage, index) => (
            <li
              key={stage.flag}
              className={[
                index <= activeStageIndex ? 'is-complete' : '',
                index === activeStageIndex ? 'is-current' : '',
              ].filter(Boolean).join(' ')}
              aria-current={index === activeStageIndex ? 'step' : undefined}
            >
              <span className="user-panel-tracking-marker" aria-hidden="true">
                {index <= activeStageIndex ? '✓' : index + 1}
              </span>
              <span>{stage.label}</span>
            </li>
          ))}
        </ol>
        <p className="user-panel-tracking-current">
          Current status: <strong>{getOrderStatus(order)}</strong>
        </p>
      </section>
    </div>
  );
}

export default function OrderPage({
  orders,
  loading,
  error,
  compact = false,
  onViewAll,
}: OrderPageProps) {
  const visibleOrders = compact ? orders.slice(0, 2) : orders;
  const [trackingOrder, setTrackingOrder] = useState<OrderMaster | null>(null);

  useEffect(() => {
    if (!trackingOrder) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTrackingOrder(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [trackingOrder]);

  return (
    <>
      <div className={compact ? '' : 'user-panel-section'}>
        <section className="user-panel-card">
          <div className="user-panel-card-heading">
            <div>
              <p className="eyebrow">{compact ? 'RECENT ACTIVITY' : 'ORDER HISTORY'}</p>
              <h3>{compact ? 'Recent orders' : 'Your orders'}</h3>
            </div>
            {compact && onViewAll && (
              <button type="button" onClick={onViewAll}>
                View all orders <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
          <div className={`user-panel-order-list${compact ? '' : ' user-panel-order-list-scroll'}`}>
            {loading && <p role="status">Loading your orders…</p>}
            {!loading && error && <p role="alert">{error}</p>}
            {!loading && !error && orders.length === 0 && (
              <p className="user-panel-order-empty">You haven’t placed an order yet.</p>
            )}
            {!loading && !error && visibleOrders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                trackingOpen={trackingOrder?._id === order._id}
                onTrack={() => setTrackingOrder(order)}
              />
            ))}
          </div>
        </section>
      </div>
      {trackingOrder && (
        <TrackingDialog order={trackingOrder} onClose={() => setTrackingOrder(null)} />
      )}
    </>
  );
}
