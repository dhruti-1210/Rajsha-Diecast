'use client';
import { useEffect, useState } from 'react';
import { getPackagingTypeList } from '@/api/PackagingApi';
import type { PackagingType } from '@/types/PackagingType';

export function Grading() {
  const [packagingTypes, setPackagingTypes] = useState<PackagingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadPackagingTypes() {
      try {
        const response = await getPackagingTypeList();
        if (!response.success) {
          throw new Error(response.message || 'Could not load packaging types.');
        }
        if (active) {
          setPackagingTypes(response.data.filter(
            (packagingType) => packagingType.isActive && !packagingType.isDeleted,
          ));
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error
            ? loadError.message
            : 'Could not load packaging types.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPackagingTypes();
    return () => { active = false; };
  }, []);

  return (
    <section className="section" id="grading">
      <p className="eyebrow center">Condition grading</p>
      <h2 className="title">Know the Box <em>Before You Buy</em></h2>
      <div className="grades">
        {packagingTypes.map((packagingType) => {
          const name = packagingType.packagingName.trim().toLowerCase();
          const variant = name.includes('sealed')
            ? 'sealed'
            : name.includes('open')
              ? 'opened'
              : name.includes('damage')
                ? 'damage'
                : '';

          return (
            <div className={`g${variant ? ` ${variant}` : ''}`} key={packagingType._id}>
              <h3>{packagingType.packagingName}</h3>
              <p>{packagingType.Description}</p>
            </div>
          );
        })}
      </div>
      {loading && <p role="status">Loading packaging types…</p>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && packagingTypes.length === 0 && (
        <p>No active packaging types available.</p>
      )}
    </section>
  );
}

const reviews = [
  ['Sealed card was perfect, exactly as graded. Packed like a vault.', 'Arjun, Vadodara'],
  ['Best source for Mini GT and Tarmac Works in India.', 'Meera, Kochi'],
  ['Honest photos of every flaw. This is how it should be done.', 'Rahul, Surat'],
];
export function Reviews() {
  return (
    <section className="section dark" id="reviews">
      <div className="head"><h2 className="title">Collector <em>Reviews</em></h2></div>
      <div className="reviews">{reviews.map(([q, c]) => <blockquote key={c}>“{q}”<cite>— {c}</cite></blockquote>)}</div>
    </section>
  );
}
