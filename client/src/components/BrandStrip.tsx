'use client';
import { useState } from 'react';
import { brands } from '@/data/brands';

function Logo({ name, file }: { name: string; file: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <a href="#brands" className="bl" title={name}>
      {failed ? <span>{name}</span> :
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`/images/brands/${file}`} alt={name} onError={() => setFailed(true)} />}
    </a>
  );
}

export default function BrandStrip() {
  const row = brands.map((b) => <Logo key={b.name} name={b.name} file={b.logo} />);
  return (
    <div className="brand-strip"><div className="track">{row}{brands.map((b) => <Logo key={`d-${b.name}`} name={b.name} file={b.logo} />)}</div></div>
  );
}
