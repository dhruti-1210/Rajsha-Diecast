'use client';

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

function OrderRow({ order }: { order: OrderMaster }) {
  const status = getOrderStatus(order);
  const productNames = order.items
    .map((item) => typeof item.product_ID === 'object' && item.product_ID
      ? item.product_ID.Name
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
          {order.TrackingId ? ` · Tracking ${order.TrackingId}` : ''}
        </small>
      </div>
      <span className={`user-panel-order-status${status === 'Delivered' ? ' delivered' : ''}`}>
        <i />{status}
      </span>
      <strong className="user-panel-order-price">{money(order.Total)}</strong>
    </article>
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

  return (
    <div className={compact ? '' : 'user-panel-section'}>
      {!compact && (
        <div className="user-panel-section-heading"><div><h2>Orders</h2></div></div>
      )}
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
        <div className="user-panel-order-list">
          {loading && <p role="status">Loading your orders…</p>}
          {!loading && error && <p role="alert">{error}</p>}
          {!loading && !error && orders.length === 0 && (
            <p className="user-panel-order-empty">You haven’t placed an order yet.</p>
          )}
          {!loading && !error && visibleOrders.map((order) => (
            <OrderRow key={order._id} order={order} />
          ))}
        </div>
      </section>
    </div>
  );
}
