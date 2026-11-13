'use client';
import { useState } from 'react';
import type { Product } from '@/types';

export function CarSvg({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 400 160"><path d="M20 112h360l-18-30-58-18-62-24H168l-48 30-70 14z" fill={color} />
      <circle cx="110" cy="115" r="22" fill="#111" stroke="#888" strokeWidth="5" />
      <circle cx="300" cy="115" r="22" fill="#111" stroke="#888" strokeWidth="5" /></svg>
  );
}

/** Shows /public/images/products/<image>; falls back to a coloured SVG if the file is missing. */
export default function CarImage({ p }: { p: Product }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <CarSvg color={p.color} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/images/products/${p.image}`} alt={p.name} onError={() => setFailed(true)} />;
}
