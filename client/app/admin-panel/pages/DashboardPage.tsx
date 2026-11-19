'use client';

import { useEffect, useState } from 'react';
import AdminToast from '../common/AdminToast';
import { products as storeProducts } from '@/data/products';
import Icon from '../common/AdminIcon';
import Header from '../common/header';

type DashboardProduct = Pick<(typeof storeProducts)[number], 'id' | 'price'> & {
  stock: number;
};

const STORAGE_KEY = 'rajsha_admin_products';
const initialProducts: DashboardProduct[] = storeProducts.map((product) => ({
  id: product.id,
  price: product.price,
  stock: product.left,
}));

function readDashboardProducts(): DashboardProduct[] {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialProducts;

  const parsed: unknown = JSON.parse(saved);
  if (!Array.isArray(parsed)) throw new Error('Saved product data is invalid.');
  return parsed as DashboardProduct[];
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function DashboardPage() {
  const [items, setItems] = useState<DashboardProduct[]>(initialProducts);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);

  useEffect(() => {
    try {
      setItems(readDashboardProducts());
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load saved inventory.');
      setNoticeIsError(true);
    }
  }, []);

  const lowStockCount = items.filter((product) => product.stock > 0 && product.stock <= 2).length;
  const inventoryValue = items.reduce((total, product) => total + product.price * product.stock, 0);

  return (
    <>
      <Header
        eyebrow="YOUR COLLECTOR'S GARAGE"
        title="Dashboard"
        highlight="overview"
        subtitle="A clear view of your products and stock levels."
      />

      <AdminToast message={notice} isError={noticeIsError} />

      <section className="admin-stats" aria-label="Inventory summary">
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><Icon name="box" /></span>
          <div><p>Products listed</p><strong>{items.length}</strong><small>Across your catalog</small></div>
          <span className="admin-stat-accent">01</span>
        </article>
       
      </section>
    </>
  );
}
