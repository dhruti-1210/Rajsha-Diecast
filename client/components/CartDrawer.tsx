'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import CarImage from './CarImage';
import Link from 'next/link';
import { placeOrder, MY_ORDERS_UPDATED_EVENT } from '@/api/orderMasterApi';

export default function CartDrawer() {
  const {
    cart,
    total,
    remove,
    setQuantity,
    clearCart,
    cartError,
    cartLoading,
    drawer,
    setDrawer,
    authStatus,
  } = useStore();
  const [confirmingOrder, setConfirmingOrder] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [orderError, setOrderError] = useState('');

  function closeOrderDialog() {
    if (placingOrder) return;
    setConfirmingOrder(false);
    setPlacedOrderId('');
    setOrderError('');
  }

  async function submitOrder() {
    if (authStatus !== 'authenticated') {
      setOrderError('Sign in to place your order.');
      return;
    }

    setPlacingOrder(true);
    setOrderError('');
    try {
      const response = await placeOrder();
      if (!response.success) {
        throw new Error(response.message || 'Could not place your order.');
      }
      clearCart();
      setPlacedOrderId(response.data._id);
      window.dispatchEvent(new Event(MY_ORDERS_UPDATED_EVENT));
    } catch (error) {
      setOrderError(error instanceof Error ? error.message : 'Could not place your order.');
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <>
      <aside className={`drawer${drawer ? ' open' : ''}`} aria-label="Shopping cart">
        <div className="dh"><h3>Your Cart</h3><button onClick={() => setDrawer(null)} aria-label="Close">&times;</button></div>
        <div id="cartItems">
          {cartError && <p role="alert">{cartError}</p>}
          {cartLoading ? <p role="status">Restoring your cart…</p>
            : cart.length === 0 ? (!cartError && <p>Your cart is empty.</p>)
              : cart.map((item, k) => (
            <div className="ci" key={item.key}>
              <Link href={`/shop/${item.id}`} className="ci-image" aria-label={`View ${item.name}`} onClick={() => setDrawer(null)}><CarImage p={item} /></Link>
              <div className="ci-details">
                <Link href={`/shop/${item.id}`} onClick={() => setDrawer(null)}>{item.name}</Link>
                <small>{item.brand} · {item.scale}</small>
                <small>{money(item.price)} each × {item.quantity}</small>
                {item.isSaving && <small role="status">Saving to your cart…</small>}
                {item.isRemoving && <small role="status">Removing from your cart…</small>}
                {item.isUpdating && <small role="status">Updating quantity…</small>}
                <b>{money(item.price * item.quantity)}</b>
              </div>
              <div className="cart-item-actions">
                <div className="cart-quantity-control" aria-label={`${item.name} quantity`}>
                  <button
                    type="button"
                    aria-label={`Decrease ${item.name} quantity`}
                    onClick={() => setQuantity(item.key, item.quantity - 1)}
                    disabled={item.quantity <= 1 || item.isSaving || item.isRemoving || item.isUpdating}
                  >−</button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Increase ${item.name} quantity`}
                    onClick={() => setQuantity(item.key, item.quantity + 1)}
                    disabled={
                      item.isSaving
                      || item.isRemoving
                      || item.isUpdating
                      || (item.stock !== undefined && item.quantity >= item.stock)
                    }
                  >+</button>
                </div>
                <button aria-label={`Remove ${item.name} from cart`} onClick={() => remove(k)} disabled={item.isSaving || item.isRemoving || item.isUpdating}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="df">
          <div className="cart-checkout-row">
            <div className="cart-total"><span>Total</span><b>{money(total)}</b></div>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setOrderError('');
                setPlacedOrderId('');
                setConfirmingOrder(true);
              }}
              disabled={cartLoading || cart.length === 0 || cart.some((item) => item.isSaving || item.isRemoving || item.isUpdating)}
            >
              Order Now
            </button>
          </div>
        </div>
      </aside>
      <div
        className={`modal${confirmingOrder ? ' open' : ''}`}
        role="presentation"
        onClick={closeOrderDialog}
      >
        <section
          className="mbox order-confirmation-box"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-confirmation-title"
          onClick={(event) => event.stopPropagation()}
        >
          <button type="button" id="closeM" aria-label="Close order summary" onClick={closeOrderDialog}>×</button>
          {placedOrderId ? (
            <div className="order-confirmation-success">
              <h2 id="order-confirmation-title">Order placed</h2>
              <p>Your order #{placedOrderId.slice(-8).toUpperCase()} is now in your orders.</p>
              <button type="button" className="btn" onClick={closeOrderDialog}>Done</button>
            </div>
          ) : (
            <>
              <h2 id="order-confirmation-title">Confirm your order</h2>
              <div className="order-confirmation-items">
                {cart.map((item) => (
                  <div className="order-confirmation-item" key={item.key}>
                    <span className="order-confirmation-image"><CarImage p={item} /></span>
                    <span className="order-confirmation-details">
                      <strong>{item.name}</strong>
                      <small>{item.brand} · {item.scale} · Qty {item.quantity}</small>
                      <strong className="order-confirmation-item-price">{money(item.price * item.quantity)}</strong>
                    </span>
                  </div>
                ))}
              </div>
              <div className="order-confirmation-footer">
                <div className="order-confirmation-total"><span>Total</span><strong>{money(total)}</strong></div>
                {orderError && <p className="order-confirmation-error" role="alert">{orderError}</p>}
                {authStatus === 'unauthenticated' && (
                  <Link className="btn" href="/login" onClick={closeOrderDialog}>Sign in to place order</Link>
                )}
                {authStatus !== 'unauthenticated' && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => void submitOrder()}
                    disabled={placingOrder || authStatus === 'checking'}
                  >
                    {placingOrder ? 'Placing order…' : 'Place order'}
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
