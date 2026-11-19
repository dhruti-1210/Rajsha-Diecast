import type { Brand } from '@/types/Brand';
import Link from 'next/link';
import Slider from './Slider';

export default function BrandsSection({
  brands,
  loading,
  error,
}: {
  brands: Brand[];
  loading: boolean;
  error: string;
}) {
  return (
    <section className="section" id="brands">
      <div className="head"><h2 className="title">Shop by <em>Brand</em></h2><Link href="/shop" className="more">All brands →</Link></div>
      <Slider className="brands">
        {brands.map((brand) => (
          <Link key={brand._id} href={`/shop?brand=${encodeURIComponent(brand.brandName)}`} className="brand">
            <h3>{brand.brandName}</h3>
            <small>{brand.modelCount} {brand.modelCount === 1 ? 'model' : 'models'} · {brand.scaleSize}</small>
          </Link>
        ))}
      </Slider>
      {loading && <p role="status">Loading brands…</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && brands.length === 0 && <p>No brands are available yet.</p>}
    </section>
  );
}
