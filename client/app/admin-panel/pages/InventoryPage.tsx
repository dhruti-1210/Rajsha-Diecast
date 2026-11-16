'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { products as storeProducts } from '@/data/products';
import type { Condition } from '@/types';
import Header from '../common/header';
import Icon from '../common/icon';

type AdminProduct = {
  id: number;
  name: string;
  brand: string;
  scale: string;
  price: number;
  condition: Condition;
  stock: number;
  sku: string;
};

type ProductDraft = Omit<AdminProduct, 'id'>;

type Filter = 'All products' | 'In stock' | 'Low stock' | 'Out of stock';

const STORAGE_KEY = 'rajsha_admin_products';
const PAGE_SIZE = 5;
const filters: Filter[] = ['All products', 'In stock', 'Low stock', 'Out of stock'];
const emptyDraft: ProductDraft = {
  name: '',
  brand: '',
  scale: '1:64',
  price: 0,
  condition: 'Sealed',
  stock: 0,
  sku: '',
};

const initialProducts: AdminProduct[] = storeProducts.map((product) => ({
  id: product.id,
  name: product.name,
  brand: product.brand,
  scale: product.scale,
  price: product.price,
  condition: product.condition,
  stock: product.left,
  sku: `RD-${String(product.id).padStart(3, '0')}`,
}));

function readAdminProducts(): AdminProduct[] {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialProducts;

  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed)) throw new Error('Saved product data is invalid.');
  return parsed as AdminProduct[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function InventoryPage() {
  const [items, setItems] = useState<AdminProduct[]>(initialProducts);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All products');
  const [currentPage, setCurrentPage] = useState(1);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    try {
      setItems(readAdminProducts());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load saved inventory.');
      setNoticeIsError(true);
    } finally {
      setStorageReady(true);
    }
  }, []);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((product) => {
      const matchesQuery = `${product.name} ${product.brand} ${product.sku}`
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesFilter = filter === 'All products'
        || (filter === 'In stock' && product.stock > 2)
        || (filter === 'Low stock' && product.stock > 0 && product.stock <= 2)
        || (filter === 'Out of stock' && product.stock === 0);
      return matchesQuery && matchesFilter;
    });
  }, [filter, items, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, query]);

  const pageCount = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE));
  const displayedPage = Math.min(currentPage, pageCount);
  const pageStart = (displayedPage - 1) * PAGE_SIZE;
  const pageItems = visibleItems.slice(pageStart, pageStart + PAGE_SIZE);
  const outOfStockCount = items.filter((product) => product.stock === 0).length;

  function persist(nextItems: AdminProduct[], message: string) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
      setItems(nextItems);
      setNotice(message);
      setNoticeIsError(false);
    } catch {
      setNotice('Could not save your changes in this browser. Check available storage and try again.');
      setNoticeIsError(true);
    }
  }

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(product: AdminProduct) {
    const { id, ...productDraft } = product;
    setEditingId(id);
    setDraft(productDraft);
    setModalOpen(true);
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextItems = editingId === null
      ? [{ ...draft, id: Date.now() }, ...items]
      : items.map((product) => product.id === editingId ? { ...draft, id: editingId } : product);
    persist(nextItems, editingId === null ? 'Product added to your inventory.' : 'Product changes saved.');
    setModalOpen(false);
  }

  function deleteProduct(product: AdminProduct) {
    if (!window.confirm(`Remove "${product.name}" from the inventory?`)) return;
    persist(items.filter((item) => item.id !== product.id), 'Product removed from your inventory.');
  }

  function updateDraft<Key extends keyof ProductDraft>(key: Key, value: ProductDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
          <Header
            eyebrow="CATALOG MANAGEMENT"
            title="Product"
            highlight="inventory"
            subtitle="Manage your diecast collection and availability."
            action={(
              <button type="button" className="admin-primary-button" onClick={openCreate}>
                <Icon name="plus" size={17} /> Add product
              </button>
            )}
          />

          {notice && (
            <div className={`admin-notice ${noticeIsError ? 'admin-notice-error' : ''}`} role="status">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
                <Icon name="close" size={16} />
              </button>
            </div>
          )}

          <section className="admin-inventory-card">
            <div className="admin-inventory-header">
              <div>
                <h2>Product inventory</h2>
                <p>Manage your diecast collection and availability.</p>
              </div>
              <span className="admin-inventory-count">{outOfStockCount} out of stock</span>
            </div>

            <div className="admin-toolbar">
              <div className="admin-filter-list" aria-label="Filter inventory">
                {filters.map((item) => (
                  <button
                    className={filter === item ? 'admin-filter admin-filter-selected' : 'admin-filter'}
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    aria-pressed={filter === item}
                  >
                    {item}
                    {item === 'All products' && <span>{items.length}</span>}
                    {item === 'Out of stock' && <span>{outOfStockCount}</span>}
                  </button>
                ))}
              </div>
              <label className="admin-search">
                <Icon name="search" size={17} />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Search products"
                />
                <kbd>/</kbd>
              </label>
            </div>

            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr><th>PRODUCT</th><th>SKU</th><th>PRICE</th><th>STOCK</th><th>CONDITION</th><th><span className="admin-visually-hidden">Actions</span></th></tr>
                </thead>
                <tbody>
                  {pageItems.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <span className="admin-product-thumb"><Icon name="car" size={20} /></span>
                          <span><strong>{product.name}</strong><small>{product.brand} <i /> {product.scale}</small></span>
                        </div>
                      </td>
                      <td className="admin-sku">{product.sku}</td>
                      <td className="admin-price">{formatPrice(product.price)}</td>
                      <td><span className={`admin-stock-pill ${product.stock === 0 ? 'stock-empty' : product.stock <= 2 ? 'stock-low' : 'stock-available'}`}>
                        <i />{product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
                      </span></td>
                      <td><span className="admin-condition">{product.condition}</span></td>
                      <td>
                        <div className="admin-row-actions">
                          <button type="button" onClick={() => openEdit(product)} aria-label={`Edit ${product.name}`} title="Edit product">
                            <Icon name="edit" size={16} />
                          </button>
                          <button type="button" onClick={() => deleteProduct(product)} aria-label={`Delete ${product.name}`} title="Delete product">
                            <Icon name="trash" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleItems.length === 0 && (
                    <tr><td className="admin-empty" colSpan={6}>No products match your search. Try another term or filter.</td></tr>
                  )}
                  {!storageReady && (
                    <tr><td className="admin-loading" colSpan={6}>Loading saved inventory…</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="admin-table-footer">
              <span>
                Showing <strong>{visibleItems.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, visibleItems.length)}</strong>
                {' '}of <strong>{visibleItems.length}</strong> products
              </span>
              <nav className="admin-pagination" aria-label="Product pages">
                <button
                  type="button"
                  onClick={() => setCurrentPage(displayedPage - 1)}
                  disabled={displayedPage === 1}
                >
                  Previous
                </button>
                <span>Page <strong>{displayedPage}</strong> of <strong>{pageCount}</strong></span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(displayedPage + 1)}
                  disabled={displayedPage === pageCount}
                >
                  Next
                </button>
              </nav>
            </div>
          </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal" onSubmit={saveProduct}>
            <div className="admin-modal-heading">
              <div><p className="admin-eyebrow">{editingId === null ? 'NEW LISTING' : 'EDIT LISTING'}</p><h2>{editingId === null ? 'Add a product' : 'Update product'}</h2></div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide"><span>Product name</span><input required maxLength={100} value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} placeholder="e.g. Nissan GT-R Nismo" /></label>
              <label className="admin-form-field"><span>Brand</span><input required maxLength={60} value={draft.brand} onChange={(event) => updateDraft('brand', event.target.value)} placeholder="e.g. Mini GT" /></label>
              <label className="admin-form-field"><span>SKU</span><input required maxLength={32} value={draft.sku} onChange={(event) => updateDraft('sku', event.target.value)} placeholder="e.g. RD-009" /></label>
              <label className="admin-form-field"><span>Scale</span>
                <select value={draft.scale} onChange={(event) => updateDraft('scale', event.target.value)}>
                  <option>1:64</option><option>1:43</option><option>1:24</option><option>1:18</option>
                </select>
              </label>
              <label className="admin-form-field"><span>Condition</span>
                <select value={draft.condition} onChange={(event) => updateDraft('condition', event.target.value as Condition)}>
                  <option>Sealed</option><option>Opened</option><option>Damage</option>
                </select>
              </label>
              <label className="admin-form-field"><span>Price (INR)</span><input required type="number" min="0" step="1" value={draft.price} onChange={(event) => updateDraft('price', Number(event.target.value))} /></label>
              <label className="admin-form-field"><span>Stock quantity</span><input required type="number" min="0" step="1" value={draft.stock} onChange={(event) => updateDraft('stock', Number(event.target.value))} /></label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button">{editingId === null ? 'Add to inventory' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
