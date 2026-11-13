'use client';
import { useEffect } from 'react';

/** Fade-in on scroll for sections, brand cards and the budget tiles. */
export default function ScrollFX() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.section, .brand');
    const io = new IntersectionObserver((es) => es.forEach((x) => {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    }), { threshold: 0.12 });
    els.forEach((el) => { el.classList.add('rv'); io.observe(el); });
    return () => io.disconnect();
  }, []);
  return null;
}
