'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import {
  changeBrandMasterStatus,
  createBrandMaster,
  deleteBrandMaster,
  getBrandMasterList,
  updateBrandMaster,
} from '../api/brandmaster';
import type { BrandMaster, BrandMasterInput } from '../types/brandMaster';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';
import { readImageAsDataUrl } from '../utils/images';

const MAX_BRAND_LOGO_FILE_SIZE = 5 * 1024 * 1024;

type BrandMasterDraft = {
  brandName: string;
  modelCount: string;
  scaleSize: string;
  isActive: boolean;
};

const emptyDraft: BrandMasterDraft = {
  brandName: '',
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
  const [deleteTarget, setDeleteTarget] = useState<BrandMaster | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  async function loadBrands() {
    setLoading(true);
    try {
      const response = await getBrandMasterList();
      setItems(response.data.filter((brand) => !brand.isDeleted));
    } finally {
      setLoading(false);
    }
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
      modelCount: String(brand.modelCount),
      scaleSize: String(brand.scaleSize),
      isActive: brand.isActive,
    });
    setModalOpen(true);
  }

  async function saveBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const brandName = draft.brandName.trim();
    const modelCount = Number(draft.modelCount);
    const scaleSize = Number(draft.scaleSize);

    if (!brandName || draft.modelCount === '' || draft.scaleSize === '') {
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

  const columns: TableColumn<BrandMaster>[] = [
    {
      name: 'LOGO',
      width: '76px',
      cell: (brand) => (
        <span className="admin-brand-logo" aria-label={`${brand.brandName} logo`}>
          {brand.brandName.charAt(0).toUpperCase()}
        </span>
      ),
    },
    { name: 'BRAND', selector: (brand) => brand.brandName, grow: 1.5, wrap: true },
    { name: 'MODELS', selector: (brand) => brand.modelCount, minWidth: '90px' },
    { name: 'SCALE SIZE', selector: (brand) => brand.scaleSize, minWidth: '100px', wrap: true },
    {
      name: 'STATUS',
      minWidth: '100px',
      cell: (brand) => (
        <span className={`admin-reference-status ${brand.isActive ? 'is-active' : 'is-inactive'}`}>
          {brand.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      name: 'ACTIONS',
      width: '150px',
      right: true,
      cell: (brand) => (
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
          <button type="button" onClick={() => setDeleteTarget(brand)} aria-label={`Delete ${brand.brandName}`} title="Delete brand">
            <Icon name="trash" size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header
        eyebrow="CATALOG MANAGEMENT"
        title="Brand"
        highlight="master"
        subtitle="Manage brands, their logos, model counts, and scale sizes."
      />

      <AdminToast message={notice} isError={noticeIsError} />
      {deleteTarget && (
        <AdminDeleteConfirm
          itemName={deleteTarget.brandName}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            if (!target) return;
            setDeleteTarget(null);
            void removeBrand(target);
          }}
        />
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Brands</h2>
            <p>Maintain the brand data used throughout your catalog.</p>
          </div>
          <button type="button" className="admin-primary-button" onClick={openCreate}>
            <Icon name="plus" size={17} /> Add brand
          </button>
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
        <AdminDataTable
          columns={columns}
          data={visibleItems}
          keyField="_id"
          loading={loading}
          emptyMessage={items.length ? 'No brands match your search.' : 'No brands yet. Add one to get started.'}
        />
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
