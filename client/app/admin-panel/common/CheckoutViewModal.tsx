'use client';

import type { Checkout, CheckoutOrderSummary, CheckoutTransaction, CheckoutUser } from '../types/checkout';
import Icon from './AdminIcon';

type CheckoutViewModalProps = {
  checkout: Checkout;
  onClose: () => void;
};

function getOrder(checkout: Checkout): CheckoutOrderSummary | null {
  return typeof checkout.order_Master_id === 'object' ? checkout.order_Master_id : null;
}

function getUser(order: CheckoutOrderSummary | null): CheckoutUser | null {
  const user = order?.user_id;
  return typeof user === 'object' && user ? user : null;
}

function formatOrderId(id?: string) {
  if (!id) return '—';
  return `#${id.slice(-8).toUpperCase()}`;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('en-IN');
}

function formatCurrency(value?: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value)
    : '—';
}

function getStatus(checkout: Checkout) {
  if (checkout.isDELIVERED) return 'Delivered';
  if (checkout.isTransist) return 'In transit';
  if (checkout.isSHIPPED) return 'Shipped';
  if (checkout.isPROCESSING) return 'Processing';
  if (checkout.isPLACED) return 'Placed';
  return 'Not started';
}

function getProductName(productId: string | { Name?: string } | null | undefined) {
  if (typeof productId === 'object' && productId) return productId.Name || 'Product';
  return 'Product';
}

function getTransactionUser(transaction: CheckoutTransaction) {
  const user = transaction.user_id;
  return typeof user === 'object' && user ? user : null;
}

export default function CheckoutViewModal({ checkout, onClose }: CheckoutViewModalProps) {
  const order = getOrder(checkout);
  const user = getUser(order);
  const items = order?.items ?? [];
  const transactions = order?.transactions ?? [];

  return (
    <div className="admin-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className="admin-product-modal admin-reference-modal" role="dialog" aria-modal="true" aria-label="Order details">
        <div className="admin-modal-heading">
          <div>
            <h1>ORDER DETAILS</h1>
          </div>
          <button type="button" className="admin-modal-close" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" />
          </button>
        </div>

        <div className="admin-form-grid" style={{ fontSize: '15px', lineHeight: '1.3' }}>
          <div className="admin-form-field">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Order ID:</span>
            <div>{formatOrderId(order?._id)}</div>
          </div>
          <div className="admin-form-field">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Tracking ID:</span>
            <div>{order?.TrackingId || '—'}</div>
          </div>
          <div className="admin-form-field">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Status:</span>
            <div>{getStatus(checkout)}</div>
          </div>
          <div className="admin-form-field">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Order Date:</span>
            <div>{formatDate(order?.createdAt || checkout.createdAt)}</div>
          </div>

          <div className="admin-form-field admin-form-wide">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>User Details:</span>
            <div>
              <div><strong>Name:</strong> {user?.name || '—'}</div>
              <div><strong>Email:</strong> {user?.email || '—'}</div>
              <div><strong>Number:</strong> {user?.mobile || '—'}</div>
              <div><strong>Address:</strong> {user?.address || '—'}</div>
            </div>
          </div>

          <div className="admin-form-field admin-form-wide">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Items:</span>
            <div>
              {items.length ? items.map((item, index) => (
                <div key={item._id || `${getProductName(item.product_ID)}-${index}`} style={{ padding: '4px 0', borderBottom: index < items.length - 1 ? '1px solid rgba(255,255,255,0.08)' : undefined }}>
                  {getProductName(item.product_ID)} × {item.Quantity ?? 0} — {formatCurrency(item.Price)}
                </div>
              )) : '—'}
            </div>
          </div>

          <div className="admin-form-field">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Subtotal:</span>
            <div>{formatCurrency(order?.SubTotal)}</div>
          </div>
          <div className="admin-form-field">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Shipping:</span>
            <div>{(order?.ShippingCharge ?? 0) > 0 ? formatCurrency(order?.ShippingCharge) : 'Free'}</div>
          </div>
          <div className="admin-form-field">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Total:</span>
            <div>{formatCurrency(order?.Total)}</div>
          </div>
          <div className="admin-form-field admin-form-wide">
            <span style={{ fontWeight: 700, fontSize: '16px' }}>Payment / Transaction:</span>
            <div>
              <div><strong>Razorpay Payment ID:</strong> {order?.RazorpayPaymentId || '—'}</div>
              {transactions.length ? transactions.map((transaction) => {
                const transactionUser = getTransactionUser(transaction);
                return (
                  <div key={transaction._id} style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div><strong>Transaction Status:</strong> {transaction.transactionStatus || '—'}</div>
                    <div><strong>Amount:</strong> {formatCurrency(transaction.txnAmount)}</div>
                    <div><strong>Gateway:</strong> {transaction.gatewayName || '—'}</div>
                    <div><strong>Email:</strong> {transactionUser?.email || user?.email || '—'}</div>
                    <div><strong>Completed At:</strong> {formatDate(transaction.completedAt || transaction.createdAt)}</div>
                  </div>
                );
              }) : <div style={{ marginTop: '8px' }}>No transaction record found.</div>}
            </div>
          </div>
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="admin-secondary-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
