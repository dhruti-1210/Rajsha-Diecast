'use client';
import { useEffect, useState } from 'react';
import { getBannerList } from '@/api/BannerApi';
import type { Banner } from '@/types/Banner';
import StoreLoader from './StoreLoader';

export default function Hero() {
  const [i, setI] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const heroSlides = banners.map((banner) => ({
    img: banner.BannerImg,
    h: banner.BannerTitle,
    p: banner.BannerSubTitle,
    cta: ['Shop New Arrivals', '#arrivals'],
    cta2: ['Shop by Budget', '#budget'],
  }));

  const go = (n: number) => setI((n + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    async function loadBanners() {
      try {
        const response = await getBannerList();
        setBanners(response.data.filter((banner) => banner.isActive && !banner.isDeleted));
        setI(0);
      } catch {
        setBanners([]);
      } finally {
        setLoading(false);
      }
    }
    void loadBanners();
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const t = setInterval(() => setI((x) => (x + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, [heroSlides.length]);
  return (
    <section className="hero" id="home">
      {loading && <StoreLoader message="Loading featured banners…" className="hero-loader" />}
      {heroSlides.map((s, k) => (
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
      {heroSlides.length > 0 && (
        <>
          <button className="arrow prev" aria-label="Previous" onClick={() => go(i - 1)}>&#10094;</button>
          <button className="arrow next" aria-label="Next" onClick={() => go(i + 1)}>&#10095;</button>
          <div className="dots">{heroSlides.map((_, k) => <i key={k} className={k === i ? 'on' : ''} onClick={() => go(k)} />)}</div>
        </>
      )}
    </section>
  );
}
