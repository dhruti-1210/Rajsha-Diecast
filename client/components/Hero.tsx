'use client';
import { useEffect, useState } from 'react';

const slides = [
  { img: '/images/hero1.png',
    h: <>Small Scale. <em>Serious</em> Collection.</>, p: 'Hot Wheels, Mini GT, Tarmac Works, Inno64 and more. Every listing states its exact packaging condition.',
    cta : ['Shop New Arrivals', '#arrivals'], cta2: ['Shop by Budget', '#budget'] },
  { img: '/images/hero2.png',
    h: <>Supercars in the <em>Palm</em> of Your Hand</>, p: 'Limited runs from Tarmac Works, Inno64 and Bburago.', cta: ['New Arrivals', '#arrivals'] },
  { img: '/images/hero3.png',
    h: <>Start Your <em>Garage</em> Today</>, p: 'Budget-friendly picks for every new collector.', cta: ['Shop by Budget', '#budget'] },
];

export default function Hero() {
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + slides.length) % slides.length);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000); return () => clearInterval(t); }, [i]);
  return (
    <section className="hero" id="home">
      {slides.map((s, k) => (
        <div key={k} className={`slide${k === i ? ' on' : ''}`} style={{ '--img': `url('${s.img}')` } as React.CSSProperties}>
          <div className="content">
            <p className="eyebrow"></p><h1>{s.h}</h1><p>{s.p}</p>
            <div className="hero-actions">
              <a href={s.cta[1]} className="btn">{s.cta[0]}</a>
              {s.cta2 && <a href={s.cta2[1]} className="btn ghost">{s.cta2[0]}</a>}
            </div>
          </div>
        </div>
      ))}
      <button className="arrow prev" aria-label="Previous" onClick={() => go(i - 1)}>&#10094;</button>
      <button className="arrow next" aria-label="Next" onClick={() => go(i + 1)}>&#10095;</button>
      <div className="dots">{slides.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => go(k)} />)}</div>
    </section>
  );
}
