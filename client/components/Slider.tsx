'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

interface Props { className: string; children: ReactNode; resetKey?: unknown }
interface Edge { start: boolean; end: boolean; fits: boolean }

/** Horizontal slider: 4 cards per row on desktop, with left/right arrows. */
export default function Slider({ className, children, resetKey }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [e, setE] = useState<Edge>({ start: true, end: true, fits: true });
  const [itemCount, setItemCount] = useState(0);
  const [activeItem, setActiveItem] = useState(0);

  const update = useCallback(() => {
    const g = ref.current; if (!g) return;
    const first = g.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(g).columnGap) || 0;
    const step = (first?.offsetWidth || 0) + gap;
    setItemCount(g.children.length);
    setActiveItem(step ? Math.min(g.children.length - 1, Math.round(g.scrollLeft / step)) : 0);
    const n = { start: g.scrollLeft < 5, end: g.scrollLeft + g.clientWidth >= g.scrollWidth - 5, fits: g.scrollWidth <= g.clientWidth + 5 };
    setE((p) => (p.start === n.start && p.end === n.end && p.fits === n.fits ? p : n));
  }, []);

  useEffect(() => { ref.current?.scrollTo({ left: 0 }); update(); }, [resetKey, update]);
  useEffect(() => { update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update); }, [update, children]);

  const go = (dir: 1 | -1) => {
    const g = ref.current; const first = g?.firstElementChild as HTMLElement | null;
    if (!g || !first) return;
    const gap = parseFloat(getComputedStyle(g).columnGap) || 0;
    const per = window.innerWidth > 1000 ? 4 : window.innerWidth > 560 ? 2 : 1;
    g.scrollBy({ left: dir * (first.offsetWidth + gap) * per, behavior: 'smooth' });
  };

  const goToItem = (index: number) => {
    const g = ref.current; const first = g?.firstElementChild as HTMLElement | null;
    if (!g || !first) return;
    const gap = parseFloat(getComputedStyle(g).columnGap) || 0;
    g.scrollTo({ left: index * (first.offsetWidth + gap), behavior: 'smooth' });
  };

  return (
    <div className="car-wrap">
      <button className="cnav l" aria-label="Previous" disabled={e.start} style={e.fits ? { display: 'none' } : undefined} onClick={() => go(-1)}>&#10094;</button>
      <div ref={ref} className={className} onScroll={update}>{children}</div>
      {itemCount > 1 && <div className="slider-dashes" aria-label="Carousel slides">
        {Array.from({ length: itemCount }, (_, index) => (
          <button key={index} type="button" className={activeItem === index ? 'active' : ''} aria-label={`Go to slide ${index + 1}`} aria-current={activeItem === index ? 'true' : undefined} onClick={() => goToItem(index)}>
            <span />
          </button>
        ))}
      </div>}
      <button className="cnav r" aria-label="Next" disabled={e.end} style={e.fits ? { display: 'none' } : undefined} onClick={() => go(1)}>&#10095;</button>
    </div>
  );
}
