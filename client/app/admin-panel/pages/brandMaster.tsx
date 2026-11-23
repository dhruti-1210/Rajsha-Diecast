'use client';

import { useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import { changeBrandMasterStatus, createBrandMaster, deleteBrandMaster, getBrandMasterList, updateBrandMaster } from '../api/brandmaster';
import type { BrandMaster, BrandMasterInput } from '../types/brandMaster';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';
import { useAdminList } from '../hooks/useAdminList';

type BrandMasterDraft = { brandName: string; modelCount: string; scaleSize: string; isActive: boolean };
const emptyDraft: BrandMasterDraft = { brandName: '', modelCount: '', scaleSize: '', isActive: true };

export default function BrandMasterPage() {
  const { items, loading, error, search, setSearch, page, setPage, pageSize, total, refresh } = useAdminList(getBrandMasterList);
  const [draft, setDraft] = useState<BrandMasterDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BrandMaster | null>(null);

  const visibleItems = useMemo(() => items.filter((brand) => !brand.isDeleted), [items]);
  const noticeText = notice || error || '';
  const noticeErr = notice ? noticeIsError : Boolean(error);

  function openCreate() { setEditingId(null); setDraft(emptyDraft); setModalOpen(true); }
  function openEdit(brand: BrandMaster) { setEditingId(brand._id); setDraft({ brandName: brand.brandName, modelCount: String(brand.modelCount), scaleSize: String(brand.scaleSize), isActive: brand.isActive }); setModalOpen(true); }

  async function saveBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const brandName = draft.brandName.trim();
    const modelCount = Number(draft.modelCount);
    const scaleSize = Number(draft.scaleSize);
    if (!brandName || draft.modelCount === '' || draft.scaleSize === '') { setNotice('Complete all brand fields before saving.'); setNoticeIsError(true); return; }
    if (!Number.isInteger(modelCount) || modelCount < 0 || !Number.isFinite(scaleSize) || scaleSize < 0) { setNotice('Enter a non-negative whole number of models and a valid scale size.'); setNoticeIsError(true); return; }
    const payload: Partial<BrandMasterInput> = { brandName, modelCount, scaleSize, isActive: draft.isActive };
    setSaving(true);
    try {
      if (editingId) await updateBrandMaster(editingId, payload);
      else await createBrandMaster(payload as BrandMasterInput);
      setModalOpen(false);
      setNotice(`Brand ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save the brand.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleBrandStatus(brand: BrandMaster) {
    try {
      await changeBrandMasterStatus(brand._id, !brand.isActive);
      setNotice(`Brand ${!brand.isActive ? 'activated' : 'deactivated'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not update brand status.');
      setNoticeIsError(true);
    }
  }

  async function removeBrand(brand: BrandMaster) {
    try {
      await deleteBrandMaster(brand._id);
      setNotice('Brand removed.');
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not remove the brand.');
      setNoticeIsError(true);
    }
  }

  const columns: TableColumn<BrandMaster>[] = [
    { name: 'LOGO', width: '76px', cell: (brand) => <span className="admin-brand-logo" aria-label={`${brand.brandName} logo`}>{brand.brandName.charAt(0).toUpperCase()}</span> },
    { name: 'BRAND', selector: (brand) => brand.brandName, grow: 1.5, wrap: true },
    { name: 'MODELS', selector: (brand) => brand.modelCount, minWidth: '90px' },
    { name: 'SCALE SIZE', selector: (brand) => brand.scaleSize, minWidth: '100px', wrap: true },
    { name: 'STATUS', minWidth: '100px', cell: (brand) => <span className={`admin-reference-status ${brand.isActive ? 'is-active' : 'is-inactive'}`}>{brand.isActive ? 'Active' : 'Inactive'}</span> },
    { name: 'ACTIONS', width: '150px', right: true, cell: (brand) => (
      <div className="admin-row-actions">
        <button type="button" onClick={() => void toggleBrandStatus(brand)} aria-label={`${brand.isActive ? 'Deactivate' : 'Activate'} ${brand.brandName}`} title={brand.isActive ? 'Deactivate brand' : 'Activate brand'}><Icon name="box" size={16} /></button>
        <button type="button" onClick={() => openEdit(brand)} aria-label={`Edit ${brand.brandName}`} title="Edit brand"><Icon name="edit" size={16} /></button>
        <button type="button" onClick={() => setDeleteTarget(brand)} aria-label={`Delete ${brand.brandName}`} title="Delete brand"><Icon name="trash" size={16} /></button>
      </div>
    ) },
  ];

  return (
    <>
      <Header eyebrow="CATALOG MANAGEMENT" title="Brand" highlight="master" subtitle="Manage brands, their logos, model counts, and scale sizes." />
      <AdminToast message={noticeText} isError={noticeErr} />
      {deleteTarget && <AdminDeleteConfirm itemName={deleteTarget.brandName} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; if (!target) return; setDeleteTarget(null); void removeBrand(target); }} />}
      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div><h2>Brands</h2><p>Maintain the brand data used throughout your catalog.</p></div>
          <button type="button" className="admin-primary-button" onClick={openCreate}><Icon name="plus" size={17} /> Add brand</button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">{total} {total === 1 ? 'brand' : 'brands'}</span>
          <label className="admin-search"><Icon name="search" size={17} /><input type="search" placeholder="Search brands..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search brands" /></label>
        </div>
        <AdminDataTable columns={columns} data={visibleItems} keyField="_id" loading={loading} emptyMessage={search ? 'No brands match your search.' : 'No brands yet. Add one to get started.'} serverPagination totalRows={total} currentPage={page} paginationPerPage={pageSize} onPageChange={setPage} />
      </section>
      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <form className="admin-product-modal" onSubmit={saveBrand}>
            <div className="admin-modal-heading">
              <div><p className="admin-eyebrow">{editingId ? 'EDIT BRAND' : 'NEW BRAND'}</p><h2>{editingId ? 'Update brand' : 'Add brand'}</h2></div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog"><Icon name="close" /></button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide"><span>Brand name</span><input required maxLength={120} value={draft.brandName} onChange={(event) => setDraft((current) => ({ ...current, brandName: event.target.value }))} placeholder="e.g. Mini GT" /></label>
              <label className="admin-form-field"><span>Model count</span><input required type="number" min="0" step="1" value={draft.modelCount} onChange={(event) => setDraft((current) => ({ ...current, modelCount: event.target.value }))} placeholder="0" /></label>
              <label className="admin-form-field"><span>Scale size</span><input required type="number" min="0" step="any" value={draft.scaleSize} onChange={(event) => setDraft((current) => ({ ...current, scaleSize: event.target.value }))} placeholder="e.g. 18" /></label>
              <label className="admin-status-toggle"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))} /><span>Active</span></label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add brand'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

