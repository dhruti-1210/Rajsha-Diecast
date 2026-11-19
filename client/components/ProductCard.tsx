'use client';
import type { Product } from '@/types';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import CarImage from './CarImage';
import Link from 'next/link';

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useStore();
  return (
    <article className="card product-card">
      {p.left > 0 && <span className="tag l">ONLY {p.left} LEFT</span>}
      <Link className="thumb product-image-container" href={`/shop/${p.id}`} aria-label={`View ${p.name}`}><CarImage p={p} /></Link>
      <div className="info">
        <small>{p.brand.toUpperCase()} · {p.scale}</small>
        <h3>{p.name}</h3>
        <div className="product-card-price-row"><span className="price">{money(p.price)}</span><span className={`cond ${p.condition}`}>{p.condition}</span></div>
        <div className="btnrow">
          <button className="add" onClick={() => add(p)} disabled={p.stock === 0}>Add to cart</button>
          <Link className="view" href={`/shop/${p.id}`}>Details</Link>
        </div>
      </div>
    </article>
  );
}
