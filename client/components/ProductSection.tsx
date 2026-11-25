'use client';
import { useEffect, useState } from 'react';
import {
  getProductCollectionTypes,
  getProductList,
  getProductPackagingTypes,
} from '@/api/ProductApi';
import { useStore } from '@/context/StoreContext';
import type { Product as StoreProduct } from '@/types';
import type { Product as ProductRecord } from '@/types/Product';
import Slider from './Slider';
import ProductCard from './ProductCard'; 
import StoreLoader from './StoreLoader';

interface Props { id: string; mode: 'featured' | 'new'; dark?: boolean }

export default function ProductSection({ id, mode, dark }: Props) {
  const { maxPrice, setMaxPrice } = useStore();
  const isNew = mode === 'new';
  const [collectionProducts, setCollectionProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCollectionProducts() {
      const collectionName = isNew ? 'new arrival' : 'premium collection';
      const collectionLabel = isNew ? 'new arrivals' : 'featured collection';
      try {
        const [productResponse, collectionResponse, packagingResponse] = await Promise.all([
          getProductList(),
          getProductCollectionTypes(),
          getProductPackagingTypes(),
        ]);
        if (!productResponse.success || !collectionResponse.success || !packagingResponse.success) {
          throw new Error(`Could not load the ${collectionLabel}.`);
        }

        const collectionIds = new Set(
          collectionResponse.data
            .filter((collection) => (
              collection.isActive
              && collection.isDisplay !== false
              && !collection.isDeleted
              && collection.collectionName.trim().toLowerCase() === collectionName
            ))
            .map((collection) => collection._id),
        );
        const packagingNames = new Map(
          packagingResponse.data.map((packaging) => [packaging._id, packaging.packagingName]),
        );
        const productsForCollection = productResponse.data
          .filter((product) => {
            if (!product.isActive || !product.isDisplay || product.isDeleted) return false;
            if (product.Collectiontype_id) return collectionIds.has(product.Collectiontype_id);
            return product.CollectionName?.trim().toLowerCase() === collectionName;
          })
          .map((product: ProductRecord): StoreProduct => ({
            id: product._id,
            name: product.Name,
            brand: product.BrandName || product.Company_Id || '',
            scale: product.Size,
            price: product.Price,
            condition: packagingNames.get(product.Packagingtype_Id) || 'Sealed',
            color: '#d4af37',
            left: product.stockRemaining ?? product.TotalStock,
            image: product.Image?.[0] || '',
            images: product.Image ?? [],
            stock: product.stockRemaining ?? product.TotalStock,
          }));

        if (active) setCollectionProducts(productsForCollection);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : `Could not load the ${collectionLabel}.`);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCollectionProducts();
    return () => { active = false; };
  }, [isNew]);

  const items = isNew
    ? collectionProducts.slice(0, 5)
    : collectionProducts.filter((product) => product.price <= maxPrice);
  return (
    <section className={`section${dark ? ' dark' : ''}`} id={id}>
      <div className="head">
        <h2 className="title">{isNew ? 'New' : 'Featured'} <em>{isNew ? 'Arrivals' : 'Collection'}</em></h2>
        {isNew ? <a href="#" className="more">See more →</a>
          : <a href="/shop" className="more" onClick={() => setMaxPrice(Infinity)}>Show all →</a>}
      </div>
      {loading ? <StoreLoader message={`Loading ${isNew ? 'new arrivals' : 'featured collection'}…`} />
        : <Slider className="grid" resetKey={isNew ? 0 : maxPrice}>
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </Slider>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && items.length === 0 && <p>No models in this range yet.</p>}
    </section>
  );
}
