'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CarImage from '@/components/CarImage';
import { products } from '@/data/products';
import { useStore } from '@/context/StoreContext';
import { money } from '@/lib/format';
import type { Product } from '@/types';
import { getProductById, getProductPackagingTypes } from '@/api/ProductApi';

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { add } = useStore();
  const staticProduct = products.find((item) => String(item.id) === params.id);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [serverProduct, setServerProduct] = useState<Product | null>(null);
  const [loadingServerProduct, setLoadingServerProduct] = useState(!staticProduct);
  const [serverProductError, setServerProductError] = useState('');

  useEffect(() => {
    setActiveImage(0);
  }, [params.id]);

  useEffect(() => {
    if (staticProduct) return;
    let active = true;

    async function loadProduct() {
      setServerProduct(null);
      setLoadingServerProduct(true);
      setServerProductError('');
      try {
        const [productResponse, packagingResponse] = await Promise.all([
          getProductById(params.id),
          getProductPackagingTypes(),
        ]);
        if (!productResponse.success || !packagingResponse.success) {
          throw new Error('Could not load this product.');
        }

        const record = productResponse.data;
        if (!record.isActive || !record.isDisplay || record.isDeleted) {
          throw new Error('This product is not currently available.');
        }

        const serverProduct: Product = {
          id: record._id,
          name: record.Name,
          brand: record.BrandName || record.Company_Id || '',
          scale: record.Size,
          price: record.Price,
          condition: packagingResponse.data.find(
            (packaging) => packaging._id === record.Packagingtype_Id,
          )?.packagingName || 'Sealed',
          color: '#d4af37',
          left: record.TotalStock > 0 && record.TotalStock <= 2 ? record.TotalStock : 0,
          image: record.Image?.[0] || '',
          images: record.Image ?? [],
        };
        if (active) setServerProduct(serverProduct);
      } catch (error) {
        if (active) {
          setServerProductError(error instanceof Error ? error.message : 'Could not load this product.');
        }
      } finally {
        if (active) setLoadingServerProduct(false);
      }
    }

    void loadProduct();
    return () => { active = false; };
  }, [params.id, staticProduct]);

  const product = staticProduct ?? serverProduct;

  if (!product) {
    return (
      <>
        <Header />
        <main className="product-not-found">
          <Link className="back-arrow" href="/shop" aria-label="Back to shop">←</Link>
          <h1>{loadingServerProduct ? 'Loading model…' : serverProductError || 'Model not found'}</h1>
          <Link href="/shop">Browse all models</Link>
        </main>
        <Footer />
        <CartDrawer />
      </>
    );
  }

  const relatedProducts = [...products]
    .filter((item) => String(item.id) !== String(product.id))
    .sort((a, b) => {
      const score = (item: typeof product) =>
        Number(item.brand === product.brand) * 2 + Number(item.scale === product.scale);
      return score(b) - score(a);
    })
    .slice(0, 4);
  const productImages = product.images?.filter(Boolean) ?? [];
  const galleryImages = productImages.length > 0 ? productImages : [product.image];
  const activeImageSource = galleryImages[activeImage] ?? galleryImages[0] ?? product.image;
  const activeProduct = { ...product, image: activeImageSource };

  return (
    <>
      <Header />
      <main className="purchase-page">
        <div className="purchase-container">
          <button className="back-arrow purchase-back" type="button" onClick={() => router.back()} aria-label="Go back">←</button>
          <div className="purchase-card">
            <section className="purchase-specs" aria-label="Model classification">
              <div className="purchase-side-rail">CLASSIFICATION</div>
              <div className="purchase-spec-content">
                <p className="purchase-kicker">COLLECTOR DETAILS</p>
                <h2>Model<br />specification</h2>
                <div className="purchase-spec-list">
                  <div><span>Class</span><strong>Diecast car</strong></div>
                  <div><span>Brand</span><strong>{product.brand}</strong></div>
                  <div><span>Scale</span><strong>{product.scale}</strong></div>
                  <div><span>Packaging</span><strong>{product.condition}</strong></div>
                </div>
              </div>
            </section>
            <div className={`purchase-visual purchase-angle-${activeImage % 4}`} aria-label="Product image gallery">
              <div className="purchase-image-orbit" />
              <CarImage p={activeProduct} />
              {galleryImages.length > 1 && (
                <div className="purchase-thumbnails">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${index}-${image.slice(0, 32)}`}
                      type="button"
                      className={activeImage === index ? 'active' : ''}
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show product image ${index + 1}`}
                      aria-pressed={activeImage === index}
                    >
                      <CarImage p={{ ...product, image }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <section className="purchase-details" aria-label="Purchase details">
              <p className="purchase-kicker">RAJSHA DIECAST <span>·</span> {product.brand.toUpperCase()}</p>
              <h1>{product.name}</h1>
              <p className="purchase-subtitle">{product.scale} scale · Collector's model</p>
              <div className="purchase-condition">
                <span className={`cond ${product.condition}`}>{product.condition}</span>
                <span>Packaging condition</span>
              </div>
              <p className="purchase-description">A finely detailed diecast model for your collection. Review the model and packaging details before adding it to your garage.</p>
              <div className="purchase-price">
                <span>PRICE</span>
                <strong>{money(product.price)}</strong>
              </div>
              <div className="purchase-row">
              <div className="quantity-control" aria-label="Quantity">
                <button type="button" onClick={() => setQuantity((count) => Math.max(1, count - 1))} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((count) => Math.min(Math.max(product.left, 1), count + 1))} aria-label="Increase quantity">+</button>
              </div>
                <button type="button" className="btn product-add-button" onClick={() => {
                  for (let count = 0; count < quantity; count += 1) add(product);
                  setAdded(true);
                }}>Add to cart <span>·</span> {money(product.price * quantity)}</button>
              </div>
              {added && <p className="added-confirmation" role="status">{quantity} {quantity === 1 ? 'model' : 'models'} added to your cart.</p>}
              <p className="shipping-note">Carefully packed and shipped across India.</p>
              <Link href="/shop" className="continue-shopping">Continue exploring the collection →</Link>
            </section>
          </div>
        </div>
      </main>
      <section className="related-section container" aria-label="Similar models">
        <div className="related-heading">
          <p className="eyebrow">BUILD YOUR COLLECTION</p>
          <h2>You may also <em>like</em></h2>
        </div>
        <div className="related-grid">
          {relatedProducts.map((item) => (
            <article className="related-card" key={item.id}>
              {item.left > 0 && <span className="related-stock">ONLY {item.left} LEFT</span>}
              <Link href={`/shop/${item.id}`} className="related-image" aria-label={`View ${item.name}`}>
                <CarImage p={item} />
              </Link>
              <div className="related-info">
                <small>{item.brand.toUpperCase()} · {item.scale}</small>
                <Link href={`/shop/${item.id}`} className="related-name">{item.name}</Link>
                <div className="related-bottom">
                  <strong>{money(item.price)}</strong>
                  <span className={`cond ${item.condition}`}>{item.condition}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
      <CartDrawer />
    </>
  );
}
