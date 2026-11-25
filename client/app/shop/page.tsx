'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CarImage from '@/components/CarImage';
import { getBrandList } from '@/api/BrandApi';
import { getPackagingTypeList } from '@/api/PackagingApi';
import { getProductList } from '@/api/ProductApi';
import { money } from '@/lib/format';
import { getOnlyNLeft } from '@/lib/stock';
import { useStore } from '@/context/StoreContext';
import type { Product as StoreProduct } from '@/types';
import type { Brand } from '@/types/Brand';
import type { PackagingType } from '@/types/PackagingType';
import type { Product as ProductRecord } from '@/types/Product';

const PAGE_SIZE = 8;

export default function ShopPage() {
  const router = useRouter();
  const { onlyNLeft } = useStore();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [conditions, setConditions] = useState<PackagingType[]>([]);
  const [priceLimit, setPriceLimit] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filtersReady, setFiltersReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadFilters() {
      try {
        const [packagingResponse, brandResponse] = await Promise.all([
          getPackagingTypeList(),
          getBrandList(),
        ]);
        if (!packagingResponse.success || !brandResponse.success) {
          throw new Error('Could not load the product collection.');
        }

        const availableBrands = brandResponse.data.filter(
          (brand) => brand.isActive && !brand.isDeleted,
        );
        const availableConditions = packagingResponse.data.filter(
          (condition) => condition.isActive && !condition.isDeleted,
        );

        if (active) {
          setBrands(availableBrands);
          setConditions(availableConditions);

          const searchParams = new URLSearchParams(window.location.search);
          setSearchTerm(searchParams.get('q')?.trim() || '');
          const brandParam = searchParams.get('brand')?.trim().toLowerCase();
          const selectedBrand = availableBrands.find(
            (brand) => brand.brandName.trim().toLowerCase() === brandParam,
          );
          const requestedMaxPrice = searchParams.get('maxPrice');
          const requestedMinPrice = searchParams.get('minPrice');
          const parsedMaxPrice = requestedMaxPrice === null ? null : Number(requestedMaxPrice);
          const parsedMinPrice = requestedMinPrice === null ? null : Number(requestedMinPrice);

          setSelectedBrands(selectedBrand ? [selectedBrand.brandName] : []);
          setMaxPrice(
            parsedMaxPrice !== null && Number.isFinite(parsedMaxPrice) && parsedMaxPrice >= 0
              ? parsedMaxPrice
              : null,
          );
          setMinPrice(
            parsedMinPrice !== null && Number.isFinite(parsedMinPrice) && parsedMinPrice >= 0
              ? parsedMinPrice
              : null,
          );
          setCurrentPage(1);
          setFiltersReady(true);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : 'Could not load the product collection.');
          setLoading(false);
        }
      }
    }

    void loadFilters();
    return () => { active = false; };
  }, []);

  const brandIdsByName = useMemo(
    () => new Map(brands.map((brand) => [brand.brandName, brand._id])),
    [brands],
  );
  const conditionIdsByName = useMemo(
    () => new Map(conditions.map((condition) => [condition.packagingName, condition._id])),
    [conditions],
  );
  const brandNamesById = useMemo(
    () => new Map(brands.map((brand) => [brand._id, brand.brandName])),
    [brands],
  );
  const conditionNamesById = useMemo(
    () => new Map(conditions.map((condition) => [condition._id, condition.packagingName])),
    [conditions],
  );

  const effectiveMaxPrice = Math.min(maxPrice ?? priceLimit, Math.max(priceLimit, 0));

  useEffect(() => {
    if (!filtersReady) return;
    let active = true;

    async function loadProducts() {
      setLoading(true);
      try {
        const selectedBrandIds = selectedBrands
          .map((name) => brandIdsByName.get(name))
          .filter((id): id is string => Boolean(id));
        const selectedPackagingTypeIds = selectedConditions
          .map((name) => conditionIdsByName.get(name))
          .filter((id): id is string => Boolean(id));

        const productResponse = await getProductList({
          page: currentPage,
          limit: PAGE_SIZE,
          search: searchTerm.trim() || undefined,
          brandId: selectedBrandIds.length ? selectedBrandIds : undefined,
          packagingTypeId: selectedPackagingTypeIds.length ? selectedPackagingTypeIds : undefined,
          minPrice: minPrice ?? undefined,
          maxPrice: maxPrice ?? undefined,
          shop: true,
        });
        if (!productResponse.success) {
          throw new Error('Could not load the product collection.');
        }

        const availableProducts = productResponse.data.map((product: ProductRecord): StoreProduct => ({
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
          left: product.stockRemaining ?? product.TotalStock,
          image: product.Image?.[0] || '',
          stock: product.stockRemaining ?? product.TotalStock,
        }));

        if (active) {
          setProducts(availableProducts);
          setPageCount(productResponse.meta?.totalPages ?? 1);
          setTotalResults(productResponse.meta?.total ?? availableProducts.length);
          setPriceLimit(Math.max(0, productResponse.meta?.priceMax ?? 0));
          setError('');
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

    void loadProducts();
    return () => { active = false; };
  }, [
    filtersReady,
    currentPage,
    searchTerm,
    selectedBrands,
    selectedConditions,
    minPrice,
    maxPrice,
    brandIdsByName,
    conditionIdsByName,
    brandNamesById,
    conditionNamesById,
  ]);

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
                setMaxPrice(null); setMinPrice(null); setSelectedBrands([]); setSelectedConditions([]);
                setCurrentPage(1);
                router.replace('/shop');
              }}>Clear all</button></div>
              <section className="filter-group">
                <h3>Price range</h3>
                <div className="price-labels"><span>{money(minPrice ?? 0)}</span><span>{money(effectiveMaxPrice)}</span></div>
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
            {/* <div className="shop-results-bar"><span>{totalResults} models</span><span>Curated for collectors</span></div> */}
            {loading ? <p role="status">Loading models…</p>
              : error ? <p role="alert">{error}</p>
                : products.length ? <div className="row g-3 g-xl-4">
              {products.map((product) => (
                <div className="col-6 col-md-4 col-xl-3" key={product.id}>
                  <article className="shop-card">
                    <Link href={`/shop/${product.id}`} className="shop-card-image" aria-label={`View ${product.name}`}>
                      {product.stock === 0 ? (
                        <span className="shop-stock">OUT OF STOCK</span>
                      ) : getOnlyNLeft(product.stock, onlyNLeft) > 0 && (
                        <span className="shop-stock">ONLY {getOnlyNLeft(product.stock, onlyNLeft)} LEFT</span>
                      )}
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
            </div> : <div className="shop-empty">
              {searchTerm
                ? `No models found for “${searchTerm}”. Try another model, brand, or scale.`
                : 'No models match these filters. Try adjusting your selection.'}
            </div>}
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
  const [expanded, setExpanded] = useState(false);
  const visibleOptions = expanded ? options : options.slice(0, 3);

  return (
    <section className="filter-group">
      <h3>{title}</h3>
      {visibleOptions.map((option) => (
        <label className="filter-option" key={option}>
          <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
          <span>{option}</span>
        </label>
      ))}
      {options.length > 3 && (
        <button
          type="button"
          className="filter-options-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((isExpanded) => !isExpanded)}
        >
          {expanded ? 'Show less' : 'Show more'}
          <span aria-hidden="true">{expanded ? ' ↑' : ' ↓'}</span>
        </button>
      )}
    </section>
  );
}
