'use client';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import CarImage from './CarImage';

export default function ProductModal() {
  const { modal: p, setModal, add } = useStore();
  if (!p) return null;
  return (
    <div className="modal open" onClick={() => setModal(null)}>
      <div className="mbox" onClick={(e) => e.stopPropagation()}>
        <button id="closeM" aria-label="Close" onClick={() => setModal(null)}>&times;</button>
        <div className="thumb"><CarImage p={p} /></div>
        <div className="mtxt">
          <small style={{ color: 'var(--gold)' }}>{p.brand.toUpperCase()} · {p.scale}</small>
          <h3>{p.name}</h3>
          <p>Condition: <span className={`cond ${p.condition}`}>{p.condition}</span><br />Highly detailed collector model. Photos of every flaw are shared before dispatch.</p>
          <div className="price" style={{ marginBottom: 16 }}>{money(p.price)}</div>
          <button className="btn add" onClick={() => { add(p); setModal(null); }} disabled={p.stock === 0}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
