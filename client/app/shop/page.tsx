'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CarImage from '@/components/CarImage';
import { products } from '@/data/products';
import { money } from '@/lib/format';
import type { Condition } from '@/types';

const conditions: Condition[] = ['Sealed', 'Opened', 'Damage'];
const brands = [...new Set(products.map((product) => product.brand))];
const scales = [...new Set(products.map((product) => product.scale))];
const PAGE_SIZE = 8;

export default function ShopPage() {
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedScales, setSelectedScales] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => products.filter((product) =>
    product.price <= maxPrice &&
    (!selectedBrands.length || selectedBrands.includes(product.brand)) &&
    (!selectedScales.length || selectedScales.includes(product.scale)) &&
    (!selectedConditions.length || selectedConditions.some((condition) => condition === product.condition)),
  ), [maxPrice, selectedBrands, selectedScales, selectedConditions]);
  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggle = <T extends string>(values: T[], value: T, update: (next: T[]) => void) => {
    setCurrentPage(1);
    update(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <>
      <Header />
      <main className="shop-page container-fluid">
        <div className="shop-heading">
          <p className="eyebrow">THE COLLECTOR'S GARAGE</p>
          <h1>Shop <em>all models</em></h1>
          <p>Find your next favourite addition to the collection.</p>
        </div>
        <div className="row g-4 align-items-start">
          <aside className="col-12 col-lg-3 col-xl-2">
            <div className="shop-filters">
              <div className="filter-heading"><h2>Filters</h2><button type="button" onClick={() => {
                setMaxPrice(5000); setSelectedBrands([]); setSelectedScales([]); setSelectedConditions([]);
                setCurrentPage(1);
              }}>Clear all</button></div>
              <section className="filter-group">
                <h3>Price range</h3>
                <div className="price-labels"><span>₹0</span><span>{money(maxPrice)}</span></div>
                <input aria-label="Maximum price" type="range" min="0" max="5000" step="100" value={maxPrice} onChange={(event) => {
                  setMaxPrice(Number(event.target.value));
                  setCurrentPage(1);
                }} />
              </section>
              <FilterOptions title="Packaging condition" options={conditions} selected={selectedConditions} onToggle={(value) => toggle(selectedConditions, value as Condition, setSelectedConditions)} />
              <FilterOptions title="Brand" options={brands} selected={selectedBrands} onToggle={(value) => toggle(selectedBrands, value, setSelectedBrands)} />
              {/* <FilterOptions title="Scale" options={scales} selected={selectedScales} onToggle={(value) => toggle(selectedScales, value, setSelectedScales)} /> */}
            </div>
          </aside>
          <section className="col-12 col-lg-9 col-xl-10" aria-label="Product collection">
            {/* <div className="shop-results-bar"><span>{filteredProducts.length} models</span><span>Curated for collectors</span></div> */}
            {filteredProducts.length ? <div className="row g-3 g-xl-4">
              {pageProducts.map((product) => (
                <div className="col-6 col-md-4 col-xl-3" key={product.id}>
                  <article className="shop-card">
                    <Link href={`/shop/${product.id}`} className="shop-card-image" aria-label={`View ${product.name}`}>
                      {product.left > 0 && <span className="shop-stock">ONLY {product.left} LEFT</span>}
                      <CarImage p={product} />
                    </Link>
                    <div className="shop-card-info">
                      <small>{product.brand.toUpperCase()} · {product.scale}</small>
                      <Link href={`/shop/${product.id}`} className="shop-product-name">{product.name}</Link>
                      <div className="shop-card-bottom"><strong>{money(product.price)}</strong><span className={`cond ${product.condition}`}>{product.condition}</span></div>
                    </div>
                  </article>
                </div>
              ))}
            </div> : <div className="shop-empty">No models match these filters. Try adjusting your selection.</div>}
            {pageCount > 1 && <div className="shop-pagination" role="navigation" aria-label="Product pages">
              <button type="button" onClick={() => setCurrentPage((page) => page - 1)} disabled={currentPage === 1}>
                Previous
              </button>
              {Array.from({ length: pageCount }, (_, index) => {
                const page = index + 1;
                return (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}
              <button type="button" onClick={() => setCurrentPage((page) => page + 1)} disabled={currentPage === pageCount}>
                Next
              </button>
            </div>}
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

function FilterOptions({ title, options, selected, onToggle }: {
  title: string; options: string[]; selected: string[]; onToggle: (value: string) => void;
}) {
  return (
    <section className="filter-group">
      <h3>{title}</h3>
      {options.map((option) => (
        <label className="filter-option" key={option}>
          <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
          <span>{option}</span>
        </label>
      ))}
    </section>
  );
}
