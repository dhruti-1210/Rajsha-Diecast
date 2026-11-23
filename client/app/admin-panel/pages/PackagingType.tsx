'use client';

import { useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import { changePackagingTypeStatus, createPackagingType, deletePackagingType, getPackagingTypeList, updatePackagingType } from '../api/packagingTypes';
import type { PackagingType, PackagingTypeInput } from '../types/PackagingType';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';
import { richTextToPlainText } from '@/lib/richText';
import { useAdminList } from '../hooks/useAdminList';

type PackagingTypeDraft = { packagingName: string; Description: string; isActive: boolean };
const emptyDraft: PackagingTypeDraft = { packagingName: '', Description: '', isActive: true };

function nameOf(item: PackagingType) { return item.packagingName || (item as any).packaginName || ''; }

export default function PackagingTypePage() {
  const { items, loading, error, search, setSearch, page, setPage, pageSize, total, refresh } = useAdminList(getPackagingTypeList);
  const [draft, setDraft] = useState<PackagingTypeDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PackagingType | null>(null);

  const noticeText = notice || error || '';
  const noticeErr = notice ? noticeIsError : Boolean(error);

  function openCreate() { setEditingId(null); setDraft(emptyDraft); setModalOpen(true); }
  function openEdit(item: PackagingType) {
    setEditingId(item._id);
    setDraft({ packagingName: nameOf(item), Description: richTextToPlainText(item.Description || ''), isActive: item.isActive });
    setModalOpen(true);
  }

  async function savePackagingType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const packagingName = draft.packagingName.trim();
    const Description = draft.Description.trim();
    if (!packagingName || !richTextToPlainText(Description)) {
      setNotice('Packaging type and description are required.');
      setNoticeIsError(true);
      return;
    }
    const payload = { packagingName, Description, isActive: draft.isActive } as Partial<PackagingTypeInput>;
    setSaving(true);
    try {
      if (editingId) await updatePackagingType(editingId, payload);
      else await createPackagingType(payload as PackagingTypeInput);
      setModalOpen(false);
      setNotice(`Packaging type ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save the packaging type.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function togglePackagingType(item: PackagingType) {
    try {
      await changePackagingTypeStatus(item._id, !item.isActive);
      setNotice(`Packaging type ${!item.isActive ? 'activated' : 'deactivated'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not update packaging type status.');
      setNoticeIsError(true);
    }
  }

  async function removePackagingType(item: PackagingType) {
    try {
      await deletePackagingType(item._id);
      setNotice('Packaging type removed.');
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not remove the packaging type.');
      setNoticeIsError(true);
    }
  }

  const columns: TableColumn<PackagingType>[] = useMemo(() => [
    { name: 'NAME', selector: (item) => nameOf(item), grow: 1.5, wrap: true },
    { name: 'DESCRIPTION', selector: (item) => richTextToPlainText(item.Description || '') || '—', grow: 2, wrap: true },
    { name: 'STATUS', minWidth: '100px', cell: (item) => <span className={`admin-reference-status ${item.isActive ? 'is-active' : 'is-inactive'}`}>{item.isActive ? 'Active' : 'Inactive'}</span> },
    { name: 'ACTIONS', width: '150px', right: true, cell: (item) => (
      <div className="admin-row-actions">
        <button type="button" onClick={() => void togglePackagingType(item)} aria-label={`${item.isActive ? 'Deactivate' : 'Activate'} ${nameOf(item)}`} title={item.isActive ? 'Deactivate packaging type' : 'Activate packaging type'}><Icon name="box" size={16} /></button>
        <button type="button" onClick={() => openEdit(item)} aria-label={`Edit ${nameOf(item)}`} title="Edit packaging type"><Icon name="edit" size={16} /></button>
        <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${nameOf(item)}`} title="Delete packaging type"><Icon name="trash" size={16} /></button>
      </div>
    ) },
  ], []);

  return (
    <>
      <Header eyebrow="CATALOG MANAGEMENT" title="Packaging" highlight="types" subtitle="Manage packaging conditions available when adding products." />
      <AdminToast message={noticeText} isError={noticeErr} />
      {deleteTarget && <AdminDeleteConfirm itemName={nameOf(deleteTarget)} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; if (!target) return; setDeleteTarget(null); void removePackagingType(target); }} />}
      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div><h2>Packaging types</h2><p>Active types appear in the inventory packaging condition dropdown.</p></div>
          <button type="button" className="admin-primary-button" onClick={openCreate}><Icon name="plus" size={17} /> Add packaging type</button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">{total} {total === 1 ? 'type' : 'types'}</span>
          <label className="admin-search"><Icon name="search" size={17} /><input type="search" placeholder="Search packaging types..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search packaging types" /></label>
        </div>
        <AdminDataTable columns={columns} data={items} keyField="_id" loading={loading} emptyMessage={search ? 'No packaging types match your search.' : 'No packaging types yet. Add one to get started.'} serverPagination totalRows={total} currentPage={page} paginationPerPage={pageSize} onPageChange={setPage} />
      </section>
      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <form className="admin-product-modal" onSubmit={savePackagingType}>
            <div className="admin-modal-heading">
              <div><p className="admin-eyebrow">{editingId ? 'EDIT TYPE' : 'NEW TYPE'}</p><h2>{editingId ? 'Update packaging type' : 'Add packaging type'}</h2></div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog"><Icon name="close" /></button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide"><span>Packaging type</span><input required maxLength={100} value={draft.packagingName} onChange={(event) => setDraft((current) => ({ ...current, packagingName: event.target.value }))} placeholder="e.g. Sealed" /></label>
              <label className="admin-form-field admin-form-wide"><span>Description</span><textarea required rows={3} maxLength={500} value={draft.Description} onChange={(event) => setDraft((current) => ({ ...current, Description: event.target.value }))} placeholder="Describe this packaging condition" /></label>
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

