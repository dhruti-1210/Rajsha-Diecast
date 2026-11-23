'use client';

import { useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import { changeScaleSizeStatus, createScaleSize, deleteScaleSize, getScaleSizeList, updateScaleSize } from '../api/scaleSize';
import type { ScaleSize, ScaleSizeInput } from '../types/ScaleSize';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';
import { useAdminList } from '../hooks/useAdminList';

type ScaleSizeDraft = { ScaleSize: string; isActive: boolean };
const emptyDraft: ScaleSizeDraft = { ScaleSize: '', isActive: true };

export default function ScaleSizesPage() {
  const { items, loading, error, search, setSearch, page, setPage, pageSize, total, refresh } = useAdminList(getScaleSizeList);
  const [draft, setDraft] = useState<ScaleSizeDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ScaleSize | null>(null);

  const visibleItems = useMemo(() => items, [items]);
  const noticeText = notice || error || '';
  const noticeErr = notice ? noticeIsError : Boolean(error);

  function openCreate() { setEditingId(null); setDraft(emptyDraft); setModalOpen(true); }
  function openEdit(item: ScaleSize) { setEditingId(item._id); setDraft({ ScaleSize: item.ScaleSize, isActive: item.isActive }); setModalOpen(true); }

  async function saveScaleSize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.ScaleSize.trim();
    if (!value) return;
    setSaving(true);
    try {
      const payload = { ScaleSize: value, isActive: draft.isActive } as Partial<ScaleSizeInput>;
      if (editingId) await updateScaleSize(editingId, payload);
      else await createScaleSize(payload as ScaleSizeInput);
      setModalOpen(false);
      setNotice(`Scale size ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save the scale size.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleScaleSize(item: ScaleSize) {
    try {
      await changeScaleSizeStatus(item._id, !item.isActive);
      setNotice(`Scale size ${!item.isActive ? 'activated' : 'deactivated'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not update scale size status.');
      setNoticeIsError(true);
    }
  }

  async function removeScaleSize(item: ScaleSize) {
    try {
      await deleteScaleSize(item._id);
      setNotice('Scale size removed.');
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not remove the scale size.');
      setNoticeIsError(true);
    }
  }

  const columns: TableColumn<ScaleSize>[] = [
    { name: 'SCALE SIZE', selector: (item) => item.ScaleSize, grow: 2, wrap: true },
    { name: 'STATUS', minWidth: '100px', cell: (item) => <span className={`admin-reference-status ${item.isActive ? 'is-active' : 'is-inactive'}`}>{item.isActive ? 'Active' : 'Inactive'}</span> },
    { name: 'ACTIONS', width: '150px', right: true, cell: (item) => (
      <div className="admin-row-actions">
        <button type="button" onClick={() => void toggleScaleSize(item)} aria-label={`${item.isActive ? 'Deactivate' : 'Activate'} ${item.ScaleSize}`} title={item.isActive ? 'Deactivate scale size' : 'Activate scale size'}><Icon name="box" size={16} /></button>
        <button type="button" onClick={() => openEdit(item)} aria-label={`Edit ${item.ScaleSize}`} title="Edit scale size"><Icon name="edit" size={16} /></button>
        <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.ScaleSize}`} title="Delete scale size"><Icon name="trash" size={16} /></button>
      </div>
    ) },
  ];

  return (
    <>
      <Header eyebrow="CATALOG MANAGEMENT" title="Scale" highlight="sizes" subtitle="Manage the scale options available for catalog products." />
      <AdminToast message={noticeText} isError={noticeErr} />
      {deleteTarget && <AdminDeleteConfirm itemName={deleteTarget.ScaleSize} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; if (!target) return; setDeleteTarget(null); void removeScaleSize(target); }} />}
      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div><h2>Scale sizes</h2><p>Manage the scale values used across your product catalog.</p></div>
          <button type="button" className="admin-primary-button" onClick={openCreate}><Icon name="plus" size={17} /> Add scale size</button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">{total} {total === 1 ? 'scale size' : 'scale sizes'}</span>
          <label className="admin-search"><Icon name="search" size={17} /><input type="search" placeholder="Search scale sizes..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search scale sizes" /></label>
        </div>
        <AdminDataTable columns={columns} data={visibleItems} keyField="_id" loading={loading} emptyMessage={search ? 'No scale sizes match your search.' : 'No scale sizes yet. Add one to get started.'} serverPagination totalRows={total} currentPage={page} paginationPerPage={pageSize} onPageChange={setPage} />
      </section>
      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <form className="admin-product-modal" onSubmit={saveScaleSize}>
            <div className="admin-modal-heading">
              <div><p className="admin-eyebrow">{editingId ? 'EDIT SCALE' : 'NEW SCALE'}</p><h2>{editingId ? 'Update scale size' : 'Add scale size'}</h2></div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog"><Icon name="close" /></button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide"><span>Scale size</span><input required maxLength={50} value={draft.ScaleSize} onChange={(event) => setDraft((current) => ({ ...current, ScaleSize: event.target.value }))} placeholder="e.g. 1:64" /></label>
              <label className="admin-status-toggle"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))} /><span>Active</span></label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add scale size'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

