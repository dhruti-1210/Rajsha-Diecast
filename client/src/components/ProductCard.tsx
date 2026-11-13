'use client';
import type { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import CarImage from './CarImage';

export default function ProductCard({ p, isNew }: { p: Product; isNew?: boolean }) {
  const { add, setModal } = useStore();
  return (
    <article className="card">
      {p.left > 0 && <span className="tag l">ONLY {p.left} LEFT</span>}
      {isNew && <span className="tag r">NEW</span>}
      <div className="thumb" onClick={() => setModal(p)}><CarImage p={p} /></div>
      <div className="info">
        <small>{p.brand.toUpperCase()} · {p.scale}</small>
        <h3>{p.name}</h3>
        <div className="row"><span className="price">{money(p.price)}</span><span className={`cond ${p.condition}`}>{p.condition}</span></div>
        <div className="btnrow">
          <button className="add" onClick={() => add(p)}>Add to cart</button>
          <button className="view" onClick={() => setModal(p)}>View</button>
        </div>
      </div>
    </article>
  );
}
