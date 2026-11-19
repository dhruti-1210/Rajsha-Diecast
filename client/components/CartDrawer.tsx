'use client';
import { useStore } from '@/context/StoreContext';
import { money, WHATSAPP } from '@/lib/format';
import CarImage from './CarImage';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, total, remove, setQuantity, cartError, cartLoading, drawer, setDrawer } = useStore();
  const text = encodeURIComponent(`Hi Rajsha Diecast, I want to order: ${cart.map((item) => `${item.name} x${item.quantity}`).join(', ')} Total ${money(total)}`);
  return (
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
          <a className="btn" href={`https://wa.me/${WHATSAPP}?text=${text}`}>Checkout</a>
        </div>
      </div>
    </aside>
  );
}
