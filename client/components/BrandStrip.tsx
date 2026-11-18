import type { Brand } from '@/types/Brand';

function BrandName({ name }: { name: string }) {
  return (
    <a href="#brands" className="bl" title={name}>
      <span>{name}</span>
    </a>
  );
}

export default function BrandStrip({ brands }: { brands: Brand[] }) {
  const row = brands.map((brand) => (
    <BrandName key={brand._id} name={brand.brandName} />
  ));
  return (
    <div className="brand-strip">
      <div className="track">
        {row}
        {brands.map((brand) => (
          <BrandName key={`d-${brand._id}`} name={brand.brandName} />
        ))}
      </div>
    </div>
  );
}
