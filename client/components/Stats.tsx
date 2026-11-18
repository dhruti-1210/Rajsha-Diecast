'use client';
import { useEffect, useRef, useState } from 'react';
import { getCounterList } from '@/api/CounterApi';
import type { Counter } from '@/types/Counter';

function Count({ to, run, suffix }: { to: number; run: boolean; suffix: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let cur = 0; const step = Math.max(1, to / 60);
    const t = setInterval(() => { cur = Math.min(to, cur + step); setV(Math.round(cur)); if (cur >= to) clearInterval(t); }, 25);
    return () => clearInterval(t);
  }, [run, to]);
  return <b>{v}{suffix}</b>;
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCounters() {
      try {
        const response = await getCounterList();
        if (!response.success) {
          throw new Error(response.message || 'Could not load counters.');
        }
        if (active) {
          setCounters(response.data
            .filter((counter) => counter.isActive && counter.isDisplay)
            .sort((a, b) => a.sortOrder - b.sortOrder));
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : 'Could not load counters.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCounters();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([x]) => { if (x.isIntersecting) { setRun(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return (
    <section className="stats" id="stats" ref={ref}>
      {counters.map((counter) => (
        <div key={counter.counterLabel}>
          <Count to={counter.counterValue} run={run} suffix={counter.counterSuffix} />
          <span>{counter.counterLabel}</span>
        </div>
      ))}
      {loading && <p className="stats-message" role="status">Loading counters…</p>}
      {!loading && error && <p className="stats-message" role="alert">{error}</p>}
      {!loading && !error && counters.length === 0 && (
        <p className="stats-message">No counters to display.</p>
      )}
    </section>
  );
}
