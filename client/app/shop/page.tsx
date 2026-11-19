'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CarImage from '@/components/CarImage';
import { getBrandList } from '@/api/BrandApi';
import { getPackagingTypeList } from '@/api/PackagingApi';
import { getProductList } from '@/api/ProductApi';
import { money } from '@/lib/format';
import type { Product as StoreProduct } from '@/types';
import type { Brand } from '@/types/Brand';
import type { PackagingType } from '@/types/PackagingType';
import type { Product as ProductRecord } from '@/types/Product';

const PAGE_SIZE = 8;

export default function ShopPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [conditions, setConditions] = useState<PackagingType[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadShopData() {
      try {
        const [productResponse, packagingResponse, brandResponse] = await Promise.all([
          getProductList(),
          getPackagingTypeList(),
          getBrandList(),
        ]);
        if (!productResponse.success || !packagingResponse.success || !brandResponse.success) {
          throw new Error('Could not load the product collection.');
        }

        const availableBrands = brandResponse.data.filter(
          (brand) => brand.isActive && !brand.isDeleted,
        );
        const availableConditions = packagingResponse.data.filter(
          (condition) => condition.isActive && !condition.isDeleted,
        );
        const brandNamesById = new Map(
          availableBrands.map((brand) => [brand._id, brand.brandName]),
        );
        const conditionNamesById = new Map(
          availableConditions.map((condition) => [condition._id, condition.packagingName]),
        );
        const availableProducts = productResponse.data
          .filter((product) => product.isActive && product.isDisplay && !product.isDeleted)
          .map((product: ProductRecord): StoreProduct => ({
            id: product._id,
            name: product.Name,
            brand: product.BrandName?.trim()
              || brandNamesById.get(product.Company_Id || '')
              || product.Company_Id
              || 'Unknown brand',
            scale: product.Size,
            price: product.Price,
            condition: conditionNamesById.get(product.Packagingtype_Id) || 'Unknown',
            color: '#d4af37',
            left: product.TotalStock > 0 && product.TotalStock <= 2 ? product.TotalStock : 0,
            image: product.Image?.[0] || '',
          }));

        if (active) {
          setProducts(availableProducts);
          setBrands(availableBrands);
          setConditions(availableConditions);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : 'Could not load the product collection.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadShopData();
    return () => { active = false; };
  }, []);

  const priceLimit = Math.max(0, ...products.map((product) => product.price));
  const effectiveMaxPrice = maxPrice ?? priceLimit;
  const filteredProducts = useMemo(() => products.filter((product) =>
    product.price <= effectiveMaxPrice &&
    (!selectedBrands.length || selectedBrands.includes(product.brand)) &&
    (!selectedConditions.length || selectedConditions.some((condition) => condition === product.condition)),
  ), [products, effectiveMaxPrice, selectedBrands, selectedConditions]);
  const pageCount = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pageProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggle = (values: string[], value: string, update: (next: string[]) => void) => {
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
                setMaxPrice(null); setSelectedBrands([]); setSelectedConditions([]);
                setCurrentPage(1);
              }}>Clear all</button></div>
              <section className="filter-group">
                <h3>Price range</h3>
                <div className="price-labels"><span>₹0</span><span>{money(effectiveMaxPrice)}</span></div>
                <input aria-label="Maximum price" type="range" min="0" max={Math.max(priceLimit, 1)} step="100" value={effectiveMaxPrice} onChange={(event) => {
                  setMaxPrice(Number(event.target.value));
                  setCurrentPage(1);
                }} />
              </section>
              <FilterOptions title="Packaging condition" options={conditions.map((condition) => condition.packagingName)} selected={selectedConditions} onToggle={(value) => toggle(selectedConditions, value, setSelectedConditions)} />
              <FilterOptions title="Brand" options={brands.map((brand) => brand.brandName)} selected={selectedBrands} onToggle={(value) => toggle(selectedBrands, value, setSelectedBrands)} />
            </div>
          </aside>
          <section className="col-12 col-lg-9 col-xl-10" aria-label="Product collection">
            {/* <div className="shop-results-bar"><span>{filteredProducts.length} models</span><span>Curated for collectors</span></div> */}
            {loading ? <p role="status">Loading models…</p>
              : error ? <p role="alert">{error}</p>
                : filteredProducts.length ? <div className="row g-3 g-xl-4">
              {pageProducts.map((product) => (
                <div className="col-6 col-md-4 col-xl-3" key={product.id}>
                  <article className="shop-card">
                    <Link href={`/shop/${product.id}`} className="shop-card-image product-image-container" aria-label={`View ${product.name}`}>
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
