'use client';
import { products } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import Slider from './Slider';
import ProductCard from './ProductCard';

interface Props { id: string; mode: 'featured' | 'new'; dark?: boolean }

export default function ProductSection({ id, mode, dark }: Props) {
  const { maxPrice, setMaxPrice } = useStore();
  const isNew = mode === 'new';
  const items = isNew ? [...products].reverse().slice(0, 5) : products.filter((p) => p.price <= maxPrice);
  return (
    <section className={`section${dark ? ' dark' : ''}`} id={id}>
      <div className="head">
        <h2 className="title">{isNew ? 'New' : 'Featured'} <em>{isNew ? 'Arrivals' : 'Collection'}</em></h2>
        {isNew ? <a href="#" className="more">See more →</a>
          : <a href="#featured" className="more" onClick={() => setMaxPrice(Infinity)}>Show all →</a>}
      </div>
      <Slider className="grid" resetKey={isNew ? 0 : maxPrice}>
        {items.map((p) => <ProductCard key={p.id} p={p} isNew={isNew} />)}
      </Slider>
      {items.length === 0 && <p>No models in this range yet.</p>}
    </section>
  );
}
