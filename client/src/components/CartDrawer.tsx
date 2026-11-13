'use client';
import { useStore } from '@/context/StoreContext';
import { money, WHATSAPP } from '@/lib/format';

export default function CartDrawer() {
  const { cart, total, remove, drawer, setDrawer } = useStore();
  const text = encodeURIComponent(`Hi Rajsha Diecast, I want to order: ${cart.map((c) => c.name).join(', ')} Total ${money(total)}`);
  return (
    <aside className={`drawer${drawer ? ' open' : ''}`}>
      <div className="dh"><h3>Your Cart</h3><button onClick={() => setDrawer(false)} aria-label="Close">&times;</button></div>
      <div id="cartItems">
        {cart.length === 0 ? <p>Your cart is empty.</p> : cart.map((c, k) => (
          <div className="ci" key={`${c.id}-${k}`}><span>{c.name}<br /><small>{money(c.price)}</small></span><button onClick={() => remove(k)}>Remove</button></div>
        ))}
      </div>
      <div className="df">
        <div className="row"><span>Total</span><b>{money(total)}</b></div>
        <a className="btn" href={`https://wa.me/${WHATSAPP}?text=${text}`} style={{ width: '100%', textAlign: 'center', marginTop: 12 }}>Checkout on WhatsApp</a>
      </div>
    </aside>
  );
}
