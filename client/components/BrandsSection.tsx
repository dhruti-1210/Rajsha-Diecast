import { brands } from '@/data/brands';
import Slider from './Slider';

export default function BrandsSection() {
  return (
    <section className="section" id="brands">
      <div className="head"><h2 className="title">Shop by <em>Brand</em></h2><a href="#" className="more">All brands →</a></div>
      <Slider className="brands">
        {brands.map((b) => (
          <a key={b.name} href="#featured" className="brand" style={{ '--c': b.color } as React.CSSProperties}>
            <h3>{b.name}</h3><small>{b.info}</small>
          </a>
        ))}
      </Slider>
    </section>
  );
}
