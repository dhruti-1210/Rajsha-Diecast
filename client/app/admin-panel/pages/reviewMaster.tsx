'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  changeReviewMasterDisplayStatus,
  changeReviewMasterStatus,
  deleteReviewMaster,
  getReviewMasterList,
  updateReviewMaster,
} from '../api/reviewmaster';
import type { ReviewMaster } from '../types/ReviewMaster';
import Header from '../common/header';
import Icon from '../common/icon';

type ReviewDraft = {
  name: string;
  message: string;
};

const emptyDraft: ReviewDraft = { name: '', message: '' };

export default function ReviewMasterPage() {
  const [items, setItems] = useState<ReviewMaster[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);

  async function loadReviews() {
    const response = await getReviewMasterList();
    setItems(response.data.filter((review) => !review.isDeleted));
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getReviewMasterList();
        if (active) setItems(response.data.filter((review) => !review.isDeleted));
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load reviews.');
          setNoticeIsError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => { active = false; };
  }, []);

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((review) => (
      `${review.name} ${review.message}`.toLowerCase().includes(normalizedQuery)
    ));
  }, [items, query]);

  function openEdit(review: ReviewMaster) {
    setEditingId(review._id);
    setDraft({ name: review.name, message: review.message });
    setModalOpen(true);
  }

  async function saveReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;
    const name = draft.name.trim();
    const message = draft.message.trim();
    if (!name || !message) return;

    setSaving(true);
    try {
      const response = await updateReviewMaster(editingId, {
        name,
        message,
        updatedBy: 'admin',
      });
      setItems((current) => current.map((review) => (
        review._id === editingId ? response.data : review
      )));
      setModalOpen(false);
      setNotice('Review updated.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update the review.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleReviewStatus(review: ReviewMaster, isDisplay: boolean) {
    try {
      const response = isDisplay
        ? await changeReviewMasterDisplayStatus(review._id, !review.isDisplay, 'admin')
        : await changeReviewMasterStatus(review._id, !review.isActive, 'admin');
      setItems((current) => current.map((item) => (
        item._id === review._id ? response.data : item
      )));
      const enabled = isDisplay ? response.data.isDisplay : response.data.isActive;
      setNotice(`Review ${isDisplay ? 'display' : 'active'} status ${enabled ? 'enabled' : 'disabled'}.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update review status.');
      setNoticeIsError(true);
    }
  }

  async function removeReview(review: ReviewMaster) {
    if (!window.confirm(`Remove the review from ${review.name}?`)) return;
    try {
      await deleteReviewMaster(review._id, 'admin');
      setItems((current) => current.filter((item) => item._id !== review._id));
      setNotice('Review removed.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the review.');
      setNoticeIsError(true);
    }
  }

  return (
    <>
      <Header
        eyebrow="STORE CONTENT"
        title="Review"
        highlight="master"
        subtitle="Moderate customer reviews and manage their storefront visibility."
      />

      {notice && (
        <div className={`admin-notice ${noticeIsError ? 'admin-notice-error' : ''}`} role={noticeIsError ? 'alert' : 'status'}>
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Customer reviews</h2>
            <p>Edit, approve, hide, or remove submitted reviews.</p>
          </div>
          <span className="admin-inventory-count">{items.length} total</span>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'review' : 'reviews'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search reviews..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search reviews"
            />
          </label>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table admin-reference-table">
            <thead>
              <tr>
                <th>CUSTOMER</th>
                <th>REVIEW</th>
                <th>STOREFRONT</th>
                <th>STATUS</th>
                <th><span className="admin-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((review) => (
                <tr key={review._id}>
                  <td><strong className="admin-reference-name">{review.name}</strong></td>
                  <td className="admin-review-message" title={review.message}>{review.message}</td>
                  <td>
                    <button
                      type="button"
                      className={`admin-reference-status ${review.isDisplay ? 'is-active' : 'is-inactive'}`}
                      onClick={() => void toggleReviewStatus(review, true)}
                      aria-label={`${review.isDisplay ? 'Hide' : 'Display'} review by ${review.name}`}
                    >
                      {review.isDisplay ? 'Displayed' : 'Hidden'}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`admin-reference-status ${review.isActive ? 'is-active' : 'is-inactive'}`}
                      onClick={() => void toggleReviewStatus(review, false)}
                      aria-label={`${review.isActive ? 'Deactivate' : 'Activate'} review by ${review.name}`}
                    >
                      {review.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => openEdit(review)} aria-label={`Edit review by ${review.name}`} title="Edit review">
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" onClick={() => void removeReview(review)} aria-label={`Delete review by ${review.name}`} title="Delete review">
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleItems.length === 0 && !loading && (
                <tr>
                  <td className="admin-reference-empty" colSpan={5}>
                    {items.length ? 'No reviews match your search.' : 'No reviews found.'}
                  </td>
                </tr>
              )}
              {loading && (
                <tr><td className="admin-reference-empty" colSpan={5}>Loading reviews…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal admin-reference-modal" onSubmit={saveReview}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">EDIT REVIEW</p>
                <h2>Update customer review</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide">
                <span>Customer name</span>
                <input
                  required
                  maxLength={150}
                  value={draft.name}
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label className="admin-form-field admin-form-wide">
                <span>Review message</span>
                <textarea
                  required
                  rows={5}
                  value={draft.message}
                  onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))}
                />
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
