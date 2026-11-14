'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { products as sampleProducts } from '@/data/products';
import './admin-panel.css';

type AdminProduct = {
  id: number;
  name: string;
  brand: string;
  scale: string;
  price: number;
  condition: string;
  conditionNotes: string;
  stock: number;
  images: string[];
  listed: boolean;
};

type ProductDraft = Omit<AdminProduct, 'id' | 'listed'>;

const initialProducts: AdminProduct[] = sampleProducts.map((product) => ({
  ...product,
  conditionNotes: product.condition === 'Damage' ? 'Packaging damage' : product.condition,
  stock: product.left,
  images: [`/images/products/${product.image}`],
  listed: true,
}));

const emptyDraft: ProductDraft = {
  name: '',
  brand: '',
  scale: '1:64',
  price: 0,
  condition: 'Sealed',
  conditionNotes: '',
  stock: 1,
  images: [],
};

function StockLabel({ stock }: { stock: number }) {
  if (stock === 0) return <span className="admin-stock sold">Sold out</span>;
  if (stock === 1) return <span className="admin-stock low">Only 1 left</span>;
  return <span className="admin-stock available">{stock} available</span>;
}

export default function AdminPanelPage() {
  const [inventory, setInventory] = useState(initialProducts);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'listed' | 'sold'>('all');
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');

  const visibleProducts = useMemo(() => inventory.filter((product) => {
    const matchesFilter = filter === 'all'
      || (filter === 'listed' && product.listed)
      || (filter === 'sold' && product.stock === 0);
    const matchesQuery = `${product.name} ${product.brand}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  }), [filter, inventory, query]);

  const lowStockCount = inventory.filter((product) => product.listed && product.stock > 0 && product.stock <= 1).length;
  const listedCount = inventory.filter((product) => product.listed).length;
  const soldOutCount = inventory.filter((product) => product.stock === 0).length;

  function openCreateForm() {
    setEditingId(null);
    setFormOpen(true);
    setDraft({ ...emptyDraft, images: [] });
    setNotice('');
  }

  function openEditForm(product: AdminProduct) {
    setEditingId(product.id);
    setFormOpen(true);
    setDraft({
      name: product.name,
      brand: product.brand,
      scale: product.scale,
      price: product.price,
      condition: product.condition,
      conditionNotes: product.conditionNotes,
      stock: product.stock,
      images: [...product.images],
    });
    setNotice('');
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setDraft((current) => ({ ...current, images: [...current.images, ...previews] }));
    event.target.value = '';
  }

  function removePhoto(photoIndex: number) {
    setDraft((current) => {
      const photo = current.images[photoIndex];
      if (photo.startsWith('blob:')) URL.revokeObjectURL(photo);
      return { ...current, images: current.images.filter((_, index) => index !== photoIndex) };
    });
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.stock < 0 || draft.price < 0) return;
    if (!draft.images.length) {
      setNotice('Add at least one product photo before publishing.');
      return;
    }

    if (editingId === null) {
      setInventory((current) => [{ ...draft, id: Date.now(), listed: true }, ...current]);
      setNotice('Product published to this preview.');
    } else {
      setInventory((current) => current.map((product) => (
        product.id === editingId ? { ...product, ...draft } : product
      )));
      setNotice('Product changes saved to this preview.');
    }
    setFormOpen(false);
    setEditingId(null);
    setDraft({ ...emptyDraft, images: [] });
  }

  function toggleListing(id: number) {
    setInventory((current) => current.map((product) => (
      product.id === id ? { ...product, listed: !product.listed } : product
    )));
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/" aria-label="Rajsha Diecast storefront">
          <span className="admin-brand-mark">R</span>
          <span>RAJSHA <small>DIECAST ADMIN</small></span>
        </a>
        <div className="admin-nav-label">CATALOG</div>
        <a className="admin-nav-item active" href="#inventory"><span aria-hidden="true">▦</span> Products</a>
        <div className="admin-sidebar-bottom">
          <span className="admin-avatar">RD</span>
          <span>Store administrator<small>Inventory manager</small></span>
        </div>
      </aside>

      <main className="admin-main">
       

        <div className="admin-content">
          <section className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">YOUR COLLECTION, IN CONTROL</p>
              <h1>Products <em>&amp;</em> inventory</h1>
              <p className="admin-subtitle">Create and manage the models collectors can find in your store.</p>
            </div>
            <button type="button" className="admin-primary-button" onClick={openCreateForm}>
              <span aria-hidden="true">＋</span> Add product
            </button>
          </section>

          <section className="admin-metrics" aria-label="Inventory summary">
            <article className="admin-metric-card">
              <span className="admin-metric-icon">▦</span>
              <div><small>LISTED PRODUCTS</small><strong>{listedCount}</strong><span>Visible in your catalog</span></div>
            </article>
            <article className="admin-metric-card">
              <span className="admin-metric-icon warning">◷</span>
              <div><small>RUNNING LOW</small><strong>{lowStockCount}</strong><span>One piece or less left</span></div>
            </article>
            <article className="admin-metric-card">
              <span className="admin-metric-icon muted">○</span>
              <div><small>SOLD OUT</small><strong>{soldOutCount}</strong><span>Update stock to relist</span></div>
            </article>
          </section>

          {notice && <div className="admin-notice" role="status">{notice}</div>}

          {formOpen ? (
            <section className="admin-form-card" aria-labelledby="product-form-title">
              <div className="admin-form-heading">
                <div>
                  <p className="admin-eyebrow">{editingId === null ? 'NEW LISTING' : 'EDIT LISTING'}</p>
                  <h2 id="product-form-title">{editingId === null ? 'Add a product' : 'Edit product'}</h2>
                </div>
                <button type="button" className="admin-close-button" aria-label="Close form" onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                  setDraft({ ...emptyDraft, images: [] });
                }}>×</button>
              </div>

              <form onSubmit={saveProduct}>
                <div className="admin-form-layout">
                  <div className="admin-photo-column">
                    <label className="admin-field-label">PRODUCT PHOTOS <span>*</span></label>
                    <div className="admin-photo-grid">
                      {draft.images.map((image, index) => (
                        <div className="admin-photo-preview" key={`${image}-${index}`}>
                          <img src={image} alt={`Product preview ${index + 1}`} onError={(event) => {
                            event.currentTarget.style.visibility = 'hidden';
                          }} />
                          <button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => removePhoto(index)}>×</button>
                        </div>
                      ))}
                      <label className="admin-upload-tile">
                        <input type="file" accept="image/*" multiple onChange={addPhotos} />
                        <span className="admin-upload-icon">＋</span>
                        <strong>Upload photos</strong>
                        <small>JPG, PNG or WEBP</small>
                      </label>
                    </div>
                    <p className="admin-helper">Add multiple angles so collectors can inspect the model and its packaging.</p>
                  </div>

                  <div className="admin-fields">
                    <label className="admin-field">
                      <span>Product name <b>*</b></span>
                      <input required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="e.g. Nissan GT-R Nismo" />
                    </label>
                    <div className="admin-field-row">
                      <label className="admin-field">
                        <span>Brand <b>*</b></span>
                        <input required value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} placeholder="e.g. Mini GT" />
                      </label>
                      <label className="admin-field">
                        <span>Scale</span>
                        <select value={draft.scale} onChange={(event) => setDraft({ ...draft, scale: event.target.value })}>
                          <option>1:64</option><option>1:43</option><option>1:24</option><option>1:18</option><option>Other</option>
                        </select>
                      </label>
                    </div>
                    <div className="admin-field-row">
                      <label className="admin-field">
                        <span>Price <b>*</b></span>
                        <div className="admin-input-prefix"><span>₹</span><input type="number" min="0" step="1" required value={draft.price || ''} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} placeholder="0.00" /></div>
                      </label>
                      <label className="admin-field">
                        <span>Available quantity <b>*</b></span>
                        <input type="number" min="0" step="1" required value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} />
                      </label>
                    </div>
                    <label className="admin-field">
                      <span>Condition <b>*</b></span>
                      <select value={draft.condition} onChange={(event) => setDraft({ ...draft, condition: event.target.value })}>
                        <option>Sealed</option><option>Opened</option><option>Packaging damage</option><option>Opened with packaging damage</option>
                      </select>
                    </label>
                    <label className="admin-field">
                      <span>Condition details</span>
                      <textarea rows={3} value={draft.conditionNotes} onChange={(event) => setDraft({ ...draft, conditionNotes: event.target.value })} placeholder="Describe the model and packaging condition for collectors." />
                    </label>
                  </div>
                </div>
                <div className="admin-form-footer">
                  <span><i /> {draft.stock === 0 ? 'This product will show as sold out.' : `${draft.stock} ${draft.stock === 1 ? 'unit' : 'units'} available when published.`}</span>
                  <div>
                    <button type="button" className="admin-secondary-button" onClick={() => {
                      setFormOpen(false);
                      setEditingId(null);
                      setDraft({ ...emptyDraft, images: [] });
                    }}>Cancel</button>
                    <button type="submit" className="admin-primary-button">{editingId === null ? 'Publish product' : 'Save changes'} <span aria-hidden="true">→</span></button>
                  </div>
                </div>
              </form>
            </section>
          ) : null}

          <section className="admin-inventory-section" id="inventory">
            <div className="admin-inventory-heading">
              <div><h2>Product listings <span>{inventory.length}</span></h2><p>Manage prices, stock, condition and visibility.</p></div>
              <label className="admin-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></label>
            </div>
            <div className="admin-tabs" role="tablist" aria-label="Filter products">
              {([['all', 'All products'], ['listed', 'Listed'], ['sold', 'Sold out']] as const).map(([key, label]) => (
                <button type="button" role="tab" aria-selected={filter === key} className={filter === key ? 'selected' : ''} key={key} onClick={() => setFilter(key)}>{label}</button>
              ))}
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>PRODUCT</th><th>PRICE</th><th>STOCK</th><th>CONDITION</th><th>LISTING</th><th aria-label="Actions" /></tr></thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-product-cell">
                          <div className="admin-product-thumb">
                            {product.images[0] && <img src={product.images[0]} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}
                            <span aria-hidden="true">▰</span>
                          </div>
                          <div><strong>{product.name}</strong><small>{product.brand} <i /> {product.scale}</small></div>
                        </div>
                      </td>
                      <td className="admin-price">₹{product.price.toLocaleString('en-IN')}</td>
                      <td><StockLabel stock={product.stock} /></td>
                      <td><span className="admin-condition">{product.condition}</span></td>
                      <td><span className={`admin-listing-status ${product.listed ? 'is-listed' : ''}`}><i />{product.listed ? 'Listed' : 'Hidden'}</span></td>
                      <td><div className="admin-row-actions">
                        <button type="button" onClick={() => openEditForm(product)}>Edit</button>
                        <button type="button" aria-label={`${product.listed ? 'Hide' : 'List'} ${product.name}`} onClick={() => toggleListing(product.id)}>{product.listed ? 'Hide' : 'List'}</button>
                      </div></td>
                    </tr>
                  ))}
                  {visibleProducts.length === 0 && <tr><td className="admin-empty" colSpan={6}>No products match this view. Try another filter or add a product.</td></tr>}
                </tbody>
              </table>
            </div>
            <p className="admin-stock-note"><span>ⓘ</span> Stock labels update automatically: “Only 1 left” for one item and “Sold out” at zero.</p>
          </section>
          <footer className="admin-footer">RAJSHA DIECAST <span>·</span> COLLECTOR FIRST, ALWAYS</footer>
        </div>
      </main>
    </div>
  );
}
