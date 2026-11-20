'use client';

import { useEffect, useState } from 'react';
import { getBrandList } from '@/api/BrandApi';
import type { Brand } from '@/types/Brand';
import BrandStrip from './BrandStrip';
import BrandsSection from './BrandsSection';

export default function BrandShowcase() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBrands() {
      try {
        const response = await getBrandList();
        if (!response.success) {
          throw new Error(response.message || 'Could not load brands.');
        }
        if (active) {
          setBrands(response.data.filter((brand) => brand.isActive && !brand.isDeleted));
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load brands.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadBrands();
    return () => { active = false; };
  }, []);

  return (
    <>
      {!loading && <BrandStrip brands={brands} />}
      <BrandsSection brands={brands} loading={loading} error={error} />
    </>
  );
}
