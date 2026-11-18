import type { Brand } from '@/types/Brand';
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
      <div className="head"><h2 className="title">Shop by <em>Brand</em></h2><a href="#" className="more">All brands →</a></div>
      <Slider className="brands">
        {brands.map((brand) => (
          <a key={brand._id} href="#featured" className="brand">
            <h3>{brand.brandName}</h3>
            <small>{brand.modelCount} {brand.modelCount === 1 ? 'model' : 'models'} · {brand.scaleSize}</small>
          </a>
        ))}
      </Slider>
      {loading && <p role="status">Loading brands…</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && brands.length === 0 && <p>No brands are available yet.</p>}
    </section>
  );
}
