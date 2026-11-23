'use client';

import { useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import { changeCollectionTypeDisplayStatus, changeCollectionTypeStatus, createCollectionType, deleteCollectionType, getCollectionTypeList, updateCollectionType } from '../api/collectionApi';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';
import { useAdminList } from '../hooks/useAdminList';

type CollectionType = {
  _id: string;
  collectionName: string;
  collectionDescription?: string;
  Description?: string;
  image?: string;
  sortOrder?: number;
  displayOnHomepage?: boolean;
  isActive: boolean;
  isDisplay?: boolean;
  isDeleted?: boolean;
};

const emptyDraft = { collectionName: '', isActive: true, isDisplay: true };

export default function CollectionTypesPage() {
  const { items, loading, error, search, setSearch, page, setPage, pageSize, total, refresh } = useAdminList(getCollectionTypeList as any);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CollectionType | null>(null);

  const noticeText = notice || error || '';
  const noticeErr = notice ? noticeIsError : Boolean(error);
  const visibleItems = useMemo(() => (items as CollectionType[]).filter((i) => !i.isDeleted), [items]);

  function openCreate() { setEditingId(null); setDraft(emptyDraft); setModalOpen(true); }
  function openEdit(item: CollectionType) { setEditingId(item._id); setDraft({ collectionName: item.collectionName, isActive: item.isActive, isDisplay: item.isDisplay ?? true }); setModalOpen(true); }

  async function saveCollectionType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const collectionName = draft.collectionName.trim();
    if (!collectionName) return;
    setSaving(true);
    try {
      const payload = { collectionName, Description: '', isActive: draft.isActive, isDisplay: draft.isDisplay } as any;
      if (editingId) await updateCollectionType(editingId, payload);
      else await createCollectionType(payload);
      setModalOpen(false);
      setNotice(`Collection type ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save the collection type.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(item: CollectionType) {
    try {
      await changeCollectionTypeStatus(item._id, !item.isActive);
      setNotice(`Collection type ${!item.isActive ? 'activated' : 'deactivated'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not update status.');
      setNoticeIsError(true);
    }
  }

  async function removeCollectionType(item: CollectionType) {
    try {
      await deleteCollectionType(item._id);
      setNotice('Collection type removed.');
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not remove the collection type.');
      setNoticeIsError(true);
    }
  }

  const columns: TableColumn<CollectionType>[] = [
    { name: 'NAME', selector: (item) => item.collectionName, grow: 2, wrap: true },
    { name: 'STATUS', minWidth: '100px', cell: (item) => <button type="button" className={`admin-reference-status ${item.isActive ? 'is-active' : 'is-inactive'}`} onClick={() => void toggleStatus(item)}>{item.isActive ? 'Active' : 'Inactive'}</button> },
    { name: 'ACTIONS', width: '110px', right: true, cell: (item) => (
      <div className="admin-row-actions">
        <button type="button" onClick={() => openEdit(item)} aria-label={`Edit ${item.collectionName}`} title="Edit collection type"><Icon name="edit" size={16} /></button>
        <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.collectionName}`} title="Delete collection type"><Icon name="trash" size={16} /></button>
      </div>
    ) },
  ];

  return (
    <>
      <Header eyebrow="CATALOG MANAGEMENT" title="Collection" highlight="types" subtitle="Manage the collection types available in your catalog." />
      <AdminToast message={noticeText} isError={noticeErr} />
      {deleteTarget && <AdminDeleteConfirm itemName={deleteTarget.collectionName} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; if (!target) return; setDeleteTarget(null); void removeCollectionType(target); }} />}
      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div><h2>Collection types</h2><p>Manage names, availability, and storefront visibility.</p></div>
          <button type="button" className="admin-primary-button" onClick={openCreate}><Icon name="plus" size={17} /> Add collection type</button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">{total} {total === 1 ? 'type' : 'types'}</span>
          <label className="admin-search"><Icon name="search" size={17} /><input type="search" placeholder="Search collection types..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search collection types" /></label>
        </div>
        <AdminDataTable columns={columns} data={visibleItems} keyField="_id" loading={loading} emptyMessage={search ? 'No collection types match your search.' : 'No collection types yet. Add one to get started.'} serverPagination totalRows={total} currentPage={page} paginationPerPage={pageSize} onPageChange={setPage} />
      </section>
      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <form className="admin-product-modal" onSubmit={saveCollectionType}>
            <div className="admin-modal-heading">
              <div><p className="admin-eyebrow">{editingId ? 'EDIT TYPE' : 'NEW TYPE'}</p><h2>{editingId ? 'Update collection type' : 'Add collection type'}</h2></div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog"><Icon name="close" /></button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide"><span>Collection type</span><input required maxLength={100} value={draft.collectionName} onChange={(event) => setDraft((current) => ({ ...current, collectionName: event.target.value }))} placeholder="e.g. Premium Collection" /></label>
              <label className="admin-status-toggle"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))} /><span>Active</span></label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add type'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}


