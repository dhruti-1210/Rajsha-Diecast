'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  changeBrandMasterStatus,
  createBrandMaster,
  deleteBrandMaster,
  getBrandMasterList,
  updateBrandMaster,
} from '../api/brandmaster';
import type { BrandMaster, BrandMasterInput } from '../types/brandMaster';
import Header from '../common/header';
import Icon from '../common/icon';
import { readImageAsDataUrl } from '../utils/images';

const MAX_BRAND_LOGO_FILE_SIZE = 5 * 1024 * 1024;

type BrandMasterDraft = {
  brandName: string;
  brandLogo: string;
  modelCount: string;
  scaleSize: string;
  isActive: boolean;
};

const emptyDraft: BrandMasterDraft = {
  brandName: '',
  brandLogo: '',
  modelCount: '',
  scaleSize: '',
  isActive: true,
};

export default function BrandMasterPage() {
  const [items, setItems] = useState<BrandMaster[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<BrandMasterDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  async function loadBrands() {
    const response = await getBrandMasterList();
    setItems(response.data.filter((brand) => !brand.isDeleted));
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getBrandMasterList();
        if (active) setItems(response.data.filter((brand) => !brand.isDeleted));
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load brands.');
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
    return items.filter((brand) => brand.brandName.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(brand: BrandMaster) {
    setEditingId(brand._id);
    setDraft({
      brandName: brand.brandName,
      brandLogo: brand.brandLogo,
      modelCount: String(brand.modelCount),
      scaleSize: String(brand.scaleSize),
      isActive: brand.isActive,
    });
    setModalOpen(true);
  }

  async function selectBrandLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotice('Choose an image file for the brand logo.');
      setNoticeIsError(true);
      return;
    }
    if (file.size > MAX_BRAND_LOGO_FILE_SIZE) {
      setNotice('Choose a brand logo smaller than 5 MB.');
      setNoticeIsError(true);
      return;
    }

    try {
      const brandLogo = await readImageAsDataUrl(file);
      setDraft((current) => ({ ...current, brandLogo }));
      setNotice('');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load the brand logo.');
      setNoticeIsError(true);
    }
  }

  async function saveBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const brandName = draft.brandName.trim();
    const brandLogo = draft.brandLogo.trim();
    const modelCount = Number(draft.modelCount);
    const scaleSize = Number(draft.scaleSize);

    if (!brandName || !brandLogo || draft.modelCount === '' || draft.scaleSize === '') {
      setNotice('Complete all brand fields before saving.');
      setNoticeIsError(true);
      return;
    }
    if (!Number.isInteger(modelCount) || modelCount < 0 || !Number.isFinite(scaleSize) || scaleSize < 0) {
      setNotice('Enter a non-negative whole number of models and a valid scale size.');
      setNoticeIsError(true);
      return;
    }

    const actor = 'admin';
    const payload: BrandMasterInput = {
      brandName,
      brandLogo,
      modelCount,
      scaleSize,
      updatedBy: actor,
      isActive: draft.isActive,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateBrandMaster(editingId, payload);
      } else {
        await createBrandMaster({ ...payload, createdBy: actor });
      }

      setModalOpen(false);
      setNotice(`Brand ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      try {
        await loadBrands();
      } catch (error) {
        setNotice(error instanceof Error
          ? `Saved the brand, but could not refresh the list: ${error.message}`
          : 'Saved the brand, but could not refresh the list.');
        setNoticeIsError(true);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the brand.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleBrandStatus(brand: BrandMaster) {
    try {
      const response = await changeBrandMasterStatus(brand._id, !brand.isActive, 'admin');
      setItems((current) => current.map((item) => (
        item._id === brand._id ? response.data : item
      )));
      setNotice(`Brand ${response.data.isActive ? 'activated' : 'deactivated'}.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update brand status.');
      setNoticeIsError(true);
    }
  }

  async function removeBrand(brand: BrandMaster) {
    if (!window.confirm(`Remove "${brand.brandName}"?`)) return;
    try {
      await deleteBrandMaster(brand._id, 'admin');
      setItems((current) => current.filter((item) => item._id !== brand._id));
      setNotice('Brand removed.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the brand.');
      setNoticeIsError(true);
    }
  }

  return (
    <>
      <Header
        eyebrow="CATALOG MANAGEMENT"
        title="Brand"
        highlight="master"
        subtitle="Manage brands, their logos, model counts, and scale sizes."
        action={(
          <button type="button" className="admin-primary-button" onClick={openCreate}>
            <Icon name="plus" size={17} /> Add brand
          </button>
        )}
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
            <h2>Brands</h2>
            <p>Maintain the brand data used throughout your catalog.</p>
          </div>
          <span className="admin-inventory-count">{items.length} total</span>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'brand' : 'brands'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search brands..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search brands"
            />
          </label>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table admin-reference-table">
            <thead>
              <tr>
                <th>LOGO</th>
                <th>BRAND</th>
                <th>MODELS</th>
                <th>SCALE SIZE</th>
                <th>STATUS</th>
                <th><span className="admin-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((brand) => (
                <tr key={brand._id}>
                  <td><img className="admin-brand-logo" src={brand.brandLogo} alt={`${brand.brandName} logo`} /></td>
                  <td><strong className="admin-reference-name">{brand.brandName}</strong></td>
                  <td>{brand.modelCount}</td>
                  <td>{brand.scaleSize}</td>
                  <td>
                    <span className={`admin-reference-status ${brand.isActive ? 'is-active' : 'is-inactive'}`}>
                      {brand.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        onClick={() => void toggleBrandStatus(brand)}
                        aria-label={`${brand.isActive ? 'Deactivate' : 'Activate'} ${brand.brandName}`}
                        title={brand.isActive ? 'Deactivate brand' : 'Activate brand'}
                      >
                        <Icon name="box" size={16} />
                      </button>
                      <button type="button" onClick={() => openEdit(brand)} aria-label={`Edit ${brand.brandName}`} title="Edit brand">
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" onClick={() => void removeBrand(brand)} aria-label={`Delete ${brand.brandName}`} title="Delete brand">
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleItems.length === 0 && !loading && (
                <tr>
                  <td className="admin-reference-empty" colSpan={6}>
                    {items.length ? 'No brands match your search.' : 'No brands yet. Add one to get started.'}
                  </td>
                </tr>
              )}
              {loading && (
                <tr><td className="admin-reference-empty" colSpan={6}>Loading brands…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal" onSubmit={saveBrand}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">{editingId ? 'EDIT BRAND' : 'NEW BRAND'}</p>
                <h2>{editingId ? 'Update brand' : 'Add brand'}</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide">
                <span>Brand name</span>
                <input
                  required
                  maxLength={120}
                  value={draft.brandName}
                  onChange={(event) => setDraft((current) => ({ ...current, brandName: event.target.value }))}
                  placeholder="e.g. Mini GT"
                />
              </label>
              <div className="admin-form-field admin-form-wide">
                <span>Brand logo</span>
                <div className="company-setup-logo-control">
                  {draft.brandLogo ? (
                    <img src={draft.brandLogo} alt="Brand logo preview" />
                  ) : (
                    <span className="company-setup-logo-placeholder">Select a logo image</span>
                  )}
                  <input
                    ref={logoFileInputRef}
                    className="company-setup-file-input"
                    type="file"
                    accept="image/*"
                    aria-label="Upload brand logo"
                    onChange={(event) => void selectBrandLogo(event)}
                  />
                  <div className="company-setup-logo-actions">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => logoFileInputRef.current?.click()}
                    >
                      Choose image
                    </button>
                    {draft.brandLogo && (
                      <button
                        type="button"
                        className="company-setup-remove-logo"
                        onClick={() => setDraft((current) => ({ ...current, brandLogo: '' }))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <label className="admin-form-field">
                <span>Model count</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={draft.modelCount}
                  onChange={(event) => setDraft((current) => ({ ...current, modelCount: event.target.value }))}
                  placeholder="0"
                />
              </label>
              <label className="admin-form-field">
                <span>Scale size</span>
                <input
                  required
                  type="number"
                  min="0"
                  step="any"
                  value={draft.scaleSize}
                  onChange={(event) => setDraft((current) => ({ ...current, scaleSize: event.target.value }))}
                  placeholder="e.g. 18"
                />
              </label>
              <label className="admin-status-toggle">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))}
                />
                <span>Active</span>
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add brand'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
