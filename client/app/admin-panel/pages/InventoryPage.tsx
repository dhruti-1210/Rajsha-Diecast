'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Header from '../common/header';
import Icon from '../common/icon';
import {
  createProductMaster,
  deleteProductMaster,
  getProductMasterList,
  getProductMasterReferences,
  updateProductMaster,
  type BrandReference,
  type CollectionReference,
  type PackagingReference,
} from '../api/ProductApi';
import { getScaleSizeList } from '../api/scaleSize';
import type { ScaleSize } from '../types/ScaleSize';
import type { ProductMaster, ProductMasterInput } from '../types/Product';
import { readImageAsDataUrl } from '../utils/images';

type AdminProduct = {
  id: string;
  name: string;
  brand: string;
  brandId: string;
  companyId: string;
  collection: string;
  collectionTypeId: string;
  scale: string;
  price: number;
  condition: string;
  packagingTypeId: string;
  stock: number;
  sku: string;
  description: string;
  images: string[];
  isActive: boolean;
  isDisplay: boolean;
};

type ProductDraft = {
  name: string;
  brand: string;
  collectionTypeId: string;
  scale: string;
  price: number;
  packagingTypeId: string;
  stock: number;
  sku: string;
  description: string;
  images: string[];
  isActive: boolean;
  isDisplay: boolean;
};

type Filter = 'All products' | 'In stock' | 'Low stock' | 'Out of stock';
type ProductReferences = {
  brands: BrandReference[];
  packagingTypes: PackagingReference[];
  collectionTypes: CollectionReference[];
  scaleSizes: ScaleSize[];
};

const PAGE_SIZE = 5;
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PRODUCT_IMAGE_DATA_SIZE = 12 * 1024 * 1024;
const filters: Filter[] = ['All products', 'In stock', 'Low stock', 'Out of stock'];
const emptyDraft: ProductDraft = {
  name: '',
  brand: '',
  collectionTypeId: '',
  scale: '',
  price: 0,
  packagingTypeId: '',
  stock: 0,
  sku: '',
  description: '',
  images: [''],
  isActive: true,
  isDisplay: true,
};

const mapProduct = (
  product: ProductMaster,
  references: ProductReferences,
): AdminProduct => {
  const brandReference = references.brands.find(
    (brand) => brand._id === product.Company_Id,
  ) ?? references.brands.find(
    (brand) => brand.brandName === product.BrandName,
  );

  return {
    id: product._id,
    name: product.Name,
    brand: product.BrandName
      || brandReference?.brandName
      || product.Company_Id
      || '',
    brandId: brandReference?._id || product.Company_Id || product.BrandName || '',
    companyId: product.Company_Id ?? '',
    collection: references.collectionTypes.find(
      (collection) => collection._id === product.Collectiontype_id,
    )?.collectionName
      || product.CollectionName
      || product.Collectiontype_id
      || '',
    collectionTypeId: product.Collectiontype_id
      || references.collectionTypes.find(
        (collection) => collection.collectionName === product.CollectionName,
      )?._id
      || '',
    scale: product.Size,
    price: product.Price,
    condition: references.packagingTypes.find(
      (packaging) => packaging._id === product.Packagingtype_Id,
    )?.packagingName ?? product.Packagingtype_Id,
    packagingTypeId: product.Packagingtype_Id,
    stock: product.TotalStock,
    sku: product.ModelCode,
    description: product.Description,
    images: product.Image ?? [],
    isActive: product.isActive,
    isDisplay: product.isDisplay,
  };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function InventoryPage() {
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [references, setReferences] = useState<ProductReferences>({
    brands: [],
    packagingTypes: [],
    collectionTypes: [],
    scaleSizes: [],
  });
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All products');
  const [currentPage, setCurrentPage] = useState(1);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadInventory() {
      try {
        const [productResponse, productReferences, scaleSizeResponse] = await Promise.all([
          getProductMasterList(),
          getProductMasterReferences(),
          getScaleSizeList(),
        ]);
        const activeScaleSizes = scaleSizeResponse.data.filter(
          (scaleSize) => scaleSize.isActive && !scaleSize.isDeleted,
        );
        const loadedReferences = { ...productReferences, scaleSizes: activeScaleSizes };
        setReferences(loadedReferences);
        setItems(productResponse.data.map((product) => mapProduct(product, loadedReferences)));
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Could not load product inventory.');
        setNoticeIsError(true);
      } finally {
        setLoading(false);
      }
    }

    void loadInventory();
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

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(product: AdminProduct) {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      brand: product.brandId,
      collectionTypeId: product.collectionTypeId,
      scale: product.scale,
      price: product.price,
      packagingTypeId: product.packagingTypeId,
      stock: product.stock,
      sku: product.sku,
      description: product.description,
      images: product.images.length ? [...product.images] : [''],
      isActive: product.isActive,
      isDisplay: product.isDisplay,
    });
    setModalOpen(true);
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const existingProduct = editingId
      ? items.find((item) => item.id === editingId)
      : undefined;
    const selectedBrand = references.brands.find(
      (brand) => brand._id === draft.brand,
    );
    const existingBrandCanBeKept = existingProduct?.brandId === draft.brand;
    if (!selectedBrand && !existingBrandCanBeKept) {
      setNotice('Choose a brand from the brand list.');
      setNoticeIsError(true);
      return;
    }

    const collectionType = references.collectionTypes.find(
      (item) => item._id === draft.collectionTypeId,
    );
    if (!collectionType) {
      setNotice('Choose a collection type from the collection types list.');
      setNoticeIsError(true);
      return;
    }

    const scale = references.scaleSizes.some((item) => item.ScaleSize === draft.scale)
      || existingProduct?.scale === draft.scale
      ? draft.scale.trim()
      : '';
    if (!scale) {
      setNotice('Choose an active scale size.');
      setNoticeIsError(true);
      return;
    }

    const packagingType = references.packagingTypes.find(
      (item) => item._id === draft.packagingTypeId,
    );
    const packagingTypeId = packagingType?._id
      ?? (existingProduct?.packagingTypeId === draft.packagingTypeId
        ? draft.packagingTypeId
        : '');
    if (!packagingTypeId) {
      setNotice('Choose an active packaging condition.');
      setNoticeIsError(true);
      return;
    }

    const actor = 'admin';

    setSaving(true);
    try {
      const payload: ProductMasterInput = {
        Name: draft.name.trim(),
        BrandName: selectedBrand?.brandName ?? existingProduct?.brand ?? '',
        Company_Id: selectedBrand?._id ?? existingProduct?.companyId,
        TotalStock: draft.stock,
        Price: draft.price,
        ModelCode: draft.sku.trim(),
        Size: scale,
        Description: draft.description.trim(),
        Packagingtype_Id: packagingTypeId,
        Image: draft.images.map((image) => image.trim()).filter(Boolean),
        CollectionName: collectionType.collectionName,
        Collectiontype_id: collectionType._id,
        createdBy: actor,
        updatedBy: actor,
        isActive: draft.isActive,
        isDisplay: draft.isDisplay,
      };

      if (editingId === null) {
        await createProductMaster(payload);
      } else {
        await updateProductMaster(editingId, payload);
      }
      const response = await getProductMasterList();
      setItems(response.data.map((product) => mapProduct(product, references)));
      setNotice(editingId === null ? 'Product added to the database.' : 'Product changes saved.');
      setNoticeIsError(false);
      setModalOpen(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the product.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: AdminProduct) {
    if (!window.confirm(`Remove "${product.name}" from the inventory?`)) return;
    try {
      await deleteProductMaster(product.id);
      const response = await getProductMasterList();
      setItems(response.data.map((item) => mapProduct(item, references)));
      setNotice('Product removed from the database.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not delete the product.');
      setNoticeIsError(true);
    }
  }

  function updateDraft<Key extends keyof ProductDraft>(key: Key, value: ProductDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateImage(index: number, value: string) {
    setDraft((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) => imageIndex === index ? value : image),
    }));
  }

  async function addImageFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotice('Please choose an image file.');
      setNoticeIsError(true);
      return;
    }
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      setNotice('Choose an image smaller than 5 MB.');
      setNoticeIsError(true);
      return;
    }

    try {
      const imageData = await readImageAsDataUrl(file);
      const existingImageDataSize = draft.images.reduce(
        (total, image) => total + (image.startsWith('data:image/') ? image.length : 0),
        0,
      );
      if (existingImageDataSize + imageData.length > MAX_PRODUCT_IMAGE_DATA_SIZE) {
        setNotice('Uploaded product images must total less than 12 MB.');
        setNoticeIsError(true);
        return;
      }

      setDraft((current) => {
        const emptyImageIndex = current.images.findIndex((image) => !image.trim());
        if (emptyImageIndex === -1) {
          return { ...current, images: [...current.images, imageData] };
        }
        return {
          ...current,
          images: current.images.map((image, index) => index === emptyImageIndex ? imageData : image),
        };
      });
      setNotice('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load that image.');
      setNoticeIsError(true);
    }
  }

  function removeImage(index: number) {
    setDraft((current) => ({
      ...current,
      images: current.images.length === 1
        ? ['']
        : current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  }

  return (
    <>
          <Header
            eyebrow="CATALOG MANAGEMENT"
            title="Product"
            highlight="inventory"
            subtitle="Manage your diecast collection and availability."
            action={(
              <button
                type="button"
                className="admin-primary-button"
                onClick={openCreate}
              >
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
                  {visibleItems.length === 0 && !loading && (
                    <tr><td className="admin-empty" colSpan={6}>No products match your search. Try another term or filter.</td></tr>
                  )}
                  {loading && (
                    <tr><td className="admin-loading" colSpan={6}>Loading products from the database…</td></tr>
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
            {!references.collectionTypes.length && (
              <p className="admin-reference-warning" role="status">
                Create an active collection type before adding or editing products.
              </p>
            )}
            {!references.packagingTypes.length && (
              <p className="admin-reference-warning" role="status">
                No active packaging conditions are available. Add or activate one from Packaging types.
              </p>
            )}
            {!references.brands.length && (
              <p className="admin-reference-warning" role="status">
                No active brands are available. Add or activate one from Brand master.
              </p>
            )}
            {!references.scaleSizes.length && (
              <p className="admin-reference-warning" role="status">
                No active scale sizes are available. Add or activate one from Scale sizes.
              </p>
            )}
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide"><span>Product name</span><input required maxLength={100} value={draft.name} onChange={(event) => updateDraft('name', event.target.value)} placeholder="e.g. Nissan GT-R Nismo" /></label>
              <label className="admin-form-field"><span>Brand</span>
                <select
                  required
                  value={draft.brand}
                  onChange={(event) => updateDraft('brand', event.target.value)}
                >
                  <option value="" disabled>Select a brand</option>
                  {editingId
                    && draft.brand
                    && !references.brands.some((brand) => brand._id === draft.brand)
                    && (
                      <option value={draft.brand}>
                        {items.find((item) => item.id === editingId)?.brand || draft.brand} (currently assigned)
                      </option>
                    )}
                  {references.brands.map((brand) => (
                    <option key={brand._id} value={brand._id}>{brand.brandName}</option>
                  ))}
                </select>
              </label>
              <label className="admin-form-field"><span>SKU</span><input required maxLength={32} value={draft.sku} onChange={(event) => updateDraft('sku', event.target.value)} placeholder="e.g. RD-009" /></label>
              <label className="admin-form-field"><span>Scale</span>
                <select
                  required
                  value={draft.scale}
                  onChange={(event) => updateDraft('scale', event.target.value)}
                >
                  <option value="" disabled>Select a scale size</option>
                  {editingId
                    && draft.scale
                    && !references.scaleSizes.some((scaleSize) => scaleSize.ScaleSize === draft.scale)
                    && (
                      <option value={draft.scale}>{draft.scale} (currently assigned)</option>
                    )}
                  {references.scaleSizes.map((scaleSize) => (
                    <option key={scaleSize._id} value={scaleSize.ScaleSize}>
                      {scaleSize.ScaleSize}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-form-field"><span>Packaging condition</span>
                <select
                  required
                  value={draft.packagingTypeId}
                  onChange={(event) => updateDraft('packagingTypeId', event.target.value)}
                >
                  <option value="" disabled>Select a packaging condition</option>
                  {editingId
                    && draft.packagingTypeId
                    && !references.packagingTypes.some((packaging) => packaging._id === draft.packagingTypeId)
                    && (
                      <option value={draft.packagingTypeId}>
                        {items.find((item) => item.id === editingId)?.condition || 'Inactive packaging type'}
                      </option>
                    )}
                  {references.packagingTypes.map((packaging) => (
                    <option key={packaging._id} value={packaging._id}>{packaging.packagingName}</option>
                  ))}
                </select>
              </label>
              <label className="admin-form-field"><span>Collection type</span>
                <select
                  required
                  value={draft.collectionTypeId}
                  onChange={(event) => updateDraft('collectionTypeId', event.target.value)}
                >
                  <option value="" disabled>Select a collection type</option>
                  {references.collectionTypes.map((collection) => (
                    <option key={collection._id} value={collection._id}>{collection.collectionName}</option>
                  ))}
                </select>
              </label>
              <label className="admin-form-field"><span>Price (INR)</span><input required type="number" min="0" step="1" value={draft.price} onChange={(event) => updateDraft('price', Number(event.target.value))} /></label>
              <label className="admin-form-field"><span>Stock quantity</span><input required type="number" min="0" step="1" value={draft.stock} onChange={(event) => updateDraft('stock', Number(event.target.value))} /></label>
              <label className="admin-form-field admin-form-wide"><span>Description</span><textarea rows={3} value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} /></label>
              <div className="admin-form-field admin-form-wide">
                <span>Product images</span>
                {draft.images.map((image, index) => (
                  <div className="admin-image-input-row" key={`image-${index}`}>
                    {image.startsWith('data:image/') ? (
                      <div className="admin-image-preview">
                        <img src={image} alt={`Product image ${index + 1}`} />
                        <span>Uploaded image</span>
                      </div>
                    ) : (
                      <input
                        type="url"
                        aria-label={`Image URL ${index + 1}`}
                        value={image}
                        onChange={(event) => updateImage(index, event.target.value)}
                        placeholder="https://example.com/model-front.jpg"
                      />
                    )}
                    <button
                      type="button"
                      className="admin-image-remove"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      disabled={draft.images.length === 1}
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                ))}
                <input
                  ref={imageFileInputRef}
                  className="admin-image-file-input"
                  type="file"
                  accept="image/*"
                  aria-label="Upload product image"
                  onChange={addImageFile}
                />
                <button
                  type="button"
                  className="admin-add-image"
                  onClick={() => imageFileInputRef.current?.click()}
                >
                  <Icon name="plus" size={15} /> Add another image
                </button>
              </div>
              <label className="admin-status-toggle">
                <input type="checkbox" checked={draft.isActive} onChange={(event) => updateDraft('isActive', event.target.checked)} />
                <span>Active</span>
              </label>
              <label className="admin-status-toggle">
                <input type="checkbox" checked={draft.isDisplay} onChange={(event) => updateDraft('isDisplay', event.target.checked)} />
                <span>Display on storefront</span>
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving || !references.collectionTypes.length}
              >
                {saving ? 'Saving…' : editingId === null ? 'Add to inventory' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
