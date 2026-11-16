'use client';
import { useStore } from '@/context/StoreContext';
import { money, WHATSAPP } from '@/lib/format';
import CarImage from './CarImage';
import Link from 'next/link';

export default function CartDrawer() {
  const { cart, total, remove, wishlist, removeFromWishlist, drawer, setDrawer } = useStore();
  const text = encodeURIComponent(`Hi Rajsha Diecast, I want to order: ${cart.map((c) => c.name).join(', ')} Total ${money(total)}`);
  const isWishlist = drawer === 'wishlist';
  const items = isWishlist ? wishlist : cart;
  return (
    <aside className={`drawer${drawer ? ' open' : ''}`} aria-label={isWishlist ? 'Wishlist' : 'Shopping cart'}>
      <div className="dh"><h3>{isWishlist ? 'Your Wishlist' : 'Your Cart'}</h3><button onClick={() => setDrawer(null)} aria-label="Close">&times;</button></div>
      <div id="cartItems">
        {items.length === 0 ? <p>{isWishlist ? 'Your wishlist is empty. Save models you love to find them here.' : 'Your cart is empty.'}</p> : items.map((item, k) => (
          <div className="ci" key={isWishlist ? item.id : `${item.id}-${k}`}>
            <Link href={`/shop/${item.id}`} className="ci-image" aria-label={`View ${item.name}`} onClick={() => setDrawer(null)}><CarImage p={item} /></Link>
            <div className="ci-details">
              <Link href={`/shop/${item.id}`} onClick={() => setDrawer(null)}>{item.name}</Link>
              <small>{item.brand} · {item.scale}</small>
              <b>{money(item.price)}</b>
            </div>
            <button
              aria-label={`Remove ${item.name} from ${isWishlist ? 'wishlist' : 'cart'}`}
              onClick={() => isWishlist ? removeFromWishlist(item.id) : remove(k)}
            >Remove</button>
          </div>
        ))}
      </div>
      {isWishlist
        ? <div className="df"><Link className="btn" href="/shop" onClick={() => setDrawer(null)}>Continue shopping</Link></div>
        : <div className="df">
          <div className="cart-checkout-row">
            <div className="cart-total"><span>Total</span><b>{money(total)}</b></div>
            <a className="btn" href={`https://wa.me/${WHATSAPP}?text=${text}`}>Checkout</a>
          </div>
        </div>}
    </aside>
  );
}
