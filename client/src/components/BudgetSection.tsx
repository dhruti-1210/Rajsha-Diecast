'use client';
import { budgets } from '@/data/brands';
import { useStore } from '@/context/StoreContext';
import Slider from './Slider';

export default function BudgetSection() {
  const { setMaxPrice } = useStore();
  return (
    <section className="section dark" id="budget">
      <div className="head"><h2 className="title">Shop by <em>Budget</em></h2></div>
      <Slider className="budget">
        {budgets.map((b) => (
          <a key={b.label} href="#featured" className={b.premium ? 'prem' : undefined} onClick={() => setMaxPrice(b.max)}>
            <small>{b.sub}</small><b>{b.label}</b>
          </a>
        ))}
      </Slider>
    </section>
  );
}
