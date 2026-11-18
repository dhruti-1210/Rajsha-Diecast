'use client';
import { useState } from 'react';
import type { Product } from '@/types';

export function CarSvg({ color, name }: { color: string; name: string }) {
  return (
    <svg viewBox="0 0 400 160" role="img" aria-label={name}>
      <path d="M20 112h360l-18-30-58-18-62-24H168l-48 30-70 14z" fill={color} />
      <circle cx="110" cy="115" r="22" fill="#111" stroke="#888" strokeWidth="5" />
      <circle cx="300" cy="115" r="22" fill="#111" stroke="#888" strokeWidth="5" />
    </svg>
  );
}

export default function CarImage({ p }: { p: Product }) {
  const isImageSource = p.image.startsWith('data:image/')
    || p.image.startsWith('/')
    || /^https?:\/\//i.test(p.image);
  if (p.image && isImageSource) {
    return <img className="product-image" src={p.image} alt={p.name} />;
  }
  return <CarSvg color={p.color} name={p.name} />;
}
