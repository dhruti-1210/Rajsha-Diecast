import { brands } from '@/data/brands';

function BrandName({ name }: { name: string }) {
  return (
    <a href="#brands" className="bl" title={name}>
      <span>{name}</span>
    </a>
  );
}

export default function BrandStrip() {
  const row = brands.map((b) => <BrandName key={b.name} name={b.name} />);
  return (
    <div className="brand-strip">
      <div className="track">
        {row}
        {brands.map((b) => <BrandName key={`d-${b.name}`} name={b.name} />)}
      </div>
    </div>
  );
}
