'use client';
import { useEffect, useState } from 'react';
import { getPackagingTypeList } from '@/api/PackagingApi';
import { getPublicReviews } from '@/api/ReviewsApi';
import type { PackagingType } from '@/types/PackagingType';
import type { Review } from '@/types/Reviews';
import StoreLoader from './StoreLoader';

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
      {loading ? <StoreLoader message="Loading packaging types…" />
        : <div className="grades">
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
        </div>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && packagingTypes.length === 0 && (
        <p>No active packaging types available.</p>
      )}
    </section>
  );
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        const response = await getPublicReviews();
        if (!response.success) {
          throw new Error(response.message || 'Could not load reviews.');
        }
        if (active) {
          setReviews(response.data
            .filter((review) => review.isActive && review.isDisplay && !review.isDeleted)
            .slice(0, 3));
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load reviews.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadReviews();
    return () => { active = false; };
  }, []);

  return (
    <section className="section dark" id="reviews">
      <div className="head"><h2 className="title">Collector <em>Reviews</em></h2></div>
      {loading ? <StoreLoader message="Loading reviews…" />
        : <div className="reviews">
          {reviews.map((review) => (
            <blockquote key={review._id}>
              “{review.message}”
              <cite>— {review.name}</cite>
            </blockquote>
          ))}
        </div>}
      {!loading && error && <p role="alert">{error}</p>}
      {!loading && !error && reviews.length === 0 && <p>No reviews yet. Be the first to share your experience.</p>}
    </section>
  );
}
