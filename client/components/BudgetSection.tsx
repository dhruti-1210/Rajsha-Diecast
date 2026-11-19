'use client';
import { budgets } from '@/data/brands';
import Link from 'next/link';
import Slider from './Slider';

export default function BudgetSection() {
  return (
    <section className="section dark" id="budget">
      <div className="head"><h2 className="title">Shop by <em>Budget</em></h2></div>
      <Slider className="budget">
        {budgets.map((b) => (
          <Link
            key={b.label}
            href={Number.isFinite(b.max) ? `/shop?maxPrice=${b.max}` : '/shop?minPrice=1500'}
            className={b.premium ? 'prem' : undefined}
          >
            <small>{b.sub}</small><b>{b.label}</b>
          </Link>
        ))}
      </Slider>
    </section>
  );
}
