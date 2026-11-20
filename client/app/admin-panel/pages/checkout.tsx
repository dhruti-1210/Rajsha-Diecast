'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminToast from '../common/AdminToast';
import AdminSelect from '../common/AdminSelect';
import { getCheckoutList, updateCheckoutStatus } from '../api/checkout';
import type { Checkout, CheckoutStage } from '../types/checkout';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';

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

function getOrderEmail(checkout: Checkout) {
  const user = getOrder(checkout)?.user_id;
  return typeof user === 'object' && user ? user.email : '—';
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

function getOrderItems(checkout: Checkout) {
  const items = getOrder(checkout)?.items ?? [];
  return items
    .map((item) => {
      const name = typeof item.product_ID === 'object' && item.product_ID
        ? item.product_ID.Name
        : '';
      return name ? `${name} × ${item.Quantity ?? 1}` : '';
    })
    .filter(Boolean)
    .join(', ') || '—';
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
        getOrderEmail(checkout),
        order?.TrackingId,
        order?.PaymentStatus,
        getOrderItems(checkout),
        getCheckoutStage(checkout),
      ].join(' ').toLowerCase().includes(normalizedQuery);
    });
  }, [items, query]);

  async function changeStatus(checkout: Checkout, status: CheckoutStage) {
    setUpdatingIds((current) => new Set(current).add(checkout._id));
    try {
      const response = await updateCheckoutStatus(checkout._id, status, 'admin');
      setItems((current) => current.map((item) => {
        if (item._id !== checkout._id) return item;
        const currentOrder = getOrder(item);
        const updatedOrder = getOrder(response.data);
        const order = currentOrder && updatedOrder
          ? {
            ...currentOrder,
            ...updatedOrder,
            items: currentOrder.items ?? updatedOrder.items,
            user_id: currentOrder.user_id ?? updatedOrder.user_id,
          }
          : currentOrder ?? response.data.order_Master_id;
        return { ...response.data, order_Master_id: order };
      }));
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

  const columns: TableColumn<Checkout>[] = [
    { name: 'USER', selector: (checkout) => getOrderEmail(checkout), minWidth: '180px', wrap: true },
    { name: 'PRODUCTS', selector: (checkout) => getOrderItems(checkout), minWidth: '220px', wrap: true },
    { name: 'DATE', selector: (checkout) => checkout.createdAt, format: (checkout) => formatDate(checkout.createdAt), minWidth: '100px' },
    { name: 'TOTAL', selector: (checkout) => getOrder(checkout)?.Total ?? 0, format: (checkout) => formatTotal(getOrder(checkout)?.Total), minWidth: '110px' },
    { name: 'PAYMENT', selector: (checkout) => getOrder(checkout)?.PaymentStatus ?? '—', minWidth: '110px', wrap: true },
    { name: 'TRACKING', selector: (checkout) => getOrder(checkout)?.TrackingId || '—', minWidth: '120px', wrap: true },
    {
      name: 'STATUS',
      minWidth: '150px',
      cell: (checkout) => {
        const currentStage = getCheckoutStage(checkout);
        const updating = updatingIds.has(checkout._id);
        return (
          <AdminSelect
            className="admin-checkout-status-select"
            value={currentStage}
            disabled={updating}
            aria-label={`Update fulfillment status for order ${getOrderId(checkout)}`}
            onChange={(value) => {
              const selectedStage = checkoutStages.find((stage) => stage.value === value);
              if (selectedStage) void changeStatus(checkout, selectedStage.value);
            }}
            options={[
              { value: '', label: 'Not started' },
              ...checkoutStages.map((stage) => ({ value: stage.value, label: stage.label })),
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <Header
        eyebrow="ORDER MANAGEMENT"
        title="Checkout"
        highlight="orders"
        subtitle="Review checkout records and update order fulfillment progress."
      />

      <AdminToast message={notice} isError={noticeIsError} />

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
              placeholder="Search user, product, tracking, or payment..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search checkout orders"
            />
          </label>
        </div>
        <AdminDataTable
          columns={columns}
          data={visibleItems}
          keyField="_id"
          loading={loading}
          emptyMessage={items.length ? 'No checkout orders match your search.' : 'No checkout orders found.'}
        />
      </section>
    </>
  );
}
