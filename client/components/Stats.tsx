'use client';
import { useEffect, useRef, useState } from 'react';

const stats: [number, string][] = [[500, 'Models in stock'], [8, 'Top brands'], [2000, 'Happy collectors'], [28, 'States delivered']];

function Count({ to, run }: { to: number; run: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let cur = 0; const step = Math.max(1, to / 60);
    const t = setInterval(() => { cur = Math.min(to, cur + step); setV(Math.round(cur)); if (cur >= to) clearInterval(t); }, 25);
    return () => clearInterval(t);
  }, [run, to]);
  return <b>{v}</b>;
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([x]) => { if (x.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <section className="stats" id="stats" ref={ref}>
      {stats.map(([n, l]) => <div key={l}><Count to={n} run={run} /><span>{l}</span></div>)}
    </section>
  );
}
