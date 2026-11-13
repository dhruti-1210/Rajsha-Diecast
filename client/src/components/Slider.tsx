'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

interface Props { className: string; children: ReactNode; resetKey?: unknown }
interface Edge { start: boolean; end: boolean; fits: boolean }

/** Horizontal slider: 4 cards per row on desktop, with left/right arrows. */
export default function Slider({ className, children, resetKey }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [e, setE] = useState<Edge>({ start: true, end: true, fits: true });

  const update = useCallback(() => {
    const g = ref.current; if (!g) return;
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

  return (
    <div className="car-wrap">
      <button className="cnav l" aria-label="Previous" disabled={e.start} style={e.fits ? { display: 'none' } : undefined} onClick={() => go(-1)}>&#10094;</button>
      <div ref={ref} className={className} onScroll={update}>{children}</div>
      <button className="cnav r" aria-label="Next" disabled={e.end} style={e.fits ? { display: 'none' } : undefined} onClick={() => go(1)}>&#10095;</button>
    </div>
  );
}
