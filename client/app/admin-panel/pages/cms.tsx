'use client';

import { useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import AdminRichTextEditor from '../common/AdminRichTextEditor';
import { changeCmsDisplayStatus, changeCmsStatus, createCms, deleteCms, getCmsList, updateCms } from '../api/cms';
import type { Cms, CmsInput } from '../types/cms';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';
import { richTextToPlainText } from '@/lib/richText';
import { useAdminList } from '../hooks/useAdminList';

type CmsDraft = { Name: string; Description: string; isActive: boolean; isDisplay: boolean };
const emptyDraft: CmsDraft = { Name: '', Description: '', isActive: true, isDisplay: true };

export default function CmsPage() {
  const { items, loading, error, search, setSearch, page, setPage, pageSize, total, refresh } = useAdminList(getCmsList);
  const [draft, setDraft] = useState<CmsDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Cms | null>(null);

  const visibleItems = useMemo(() => items.filter((item) => !item.isDeleted), [items]);
  const noticeText = notice || error || '';
  const noticeErr = notice ? noticeIsError : Boolean(error);

  function openCreate() { setEditingId(null); setDraft(emptyDraft); setModalOpen(true); }
  function openEdit(item: Cms) { setEditingId(item._id); setDraft({ Name: item.Name, Description: item.Description, isActive: item.isActive, isDisplay: item.isDisplay }); setModalOpen(true); }

  async function saveCms(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const Name = draft.Name.trim();
    if (!Name) return;
    const payload: CmsInput = { Name, Description: draft.Description.trim(), isActive: draft.isActive, isDisplay: draft.isDisplay, updatedBy: '' };
    setSaving(true);
    try {
      if (editingId) await updateCms(editingId, payload);
      else await createCms(payload);
      setModalOpen(false);
      setNotice(`CMS content ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not save CMS content.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleCmsStatus(item: Cms, isDisplay: boolean) {
    try {
      if (isDisplay) await changeCmsDisplayStatus(item._id, !item.isDisplay);
      else await changeCmsStatus(item._id, !item.isActive);
      setNotice(`CMS ${isDisplay ? 'display' : 'active'} status updated.`);
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not update CMS status.');
      setNoticeIsError(true);
    }
  }

  async function removeCms(item: Cms) {
    try {
      await deleteCms(item._id);
      setNotice('CMS content removed.');
      setNoticeIsError(false);
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Could not remove CMS content.');
      setNoticeIsError(true);
    }
  }

  const columns: TableColumn<Cms>[] = [
    { name: 'NAME', selector: (item) => item.Name, grow: 1.2, wrap: true },
    { name: 'DESCRIPTION', selector: (item) => richTextToPlainText(item.Description) || '—', grow: 2, wrap: true },
    { name: 'STATUS', minWidth: '100px', cell: (item) => <button type="button" className={`admin-reference-status ${item.isActive ? 'is-active' : 'is-inactive'}`} onClick={() => void toggleCmsStatus(item, false)} aria-label={`${item.isActive ? 'Deactivate' : 'Activate'} ${item.Name}`}>{item.isActive ? 'Active' : 'Inactive'}</button> },
    { name: 'ACTIONS', width: '110px', right: true, cell: (item) => (
      <div className="admin-row-actions">
        <button type="button" onClick={() => openEdit(item)} aria-label={`Edit ${item.Name}`} title="Edit CMS content"><Icon name="edit" size={16} /></button>
        <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.Name}`} title="Delete CMS content"><Icon name="trash" size={16} /></button>
      </div>
    ) },
  ];

  return (
    <>
      <Header eyebrow="STORE CONTENT" title="CMS" highlight="pages" subtitle="Manage content entries and control their storefront visibility." />
      <AdminToast message={noticeText} isError={noticeErr} />
      {deleteTarget && <AdminDeleteConfirm itemName={deleteTarget.Name} onCancel={() => setDeleteTarget(null)} onConfirm={() => { const target = deleteTarget; if (!target) return; setDeleteTarget(null); void removeCms(target); }} />}
      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div><h2>CMS content</h2><p>Manage content titles, descriptions, status, and visibility.</p></div>
          <button type="button" className="admin-primary-button" onClick={openCreate}><Icon name="plus" size={17} /> Add content</button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">{total} {total === 1 ? 'entry' : 'entries'}</span>
          <label className="admin-search"><Icon name="search" size={17} /><input type="search" placeholder="Search CMS content..." value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search CMS content" /></label>
        </div>
        <AdminDataTable columns={columns} data={visibleItems} keyField="_id" loading={loading} emptyMessage={search ? 'No CMS entries match your search.' : 'No CMS entries yet. Add one to get started.'} serverPagination totalRows={total} currentPage={page} paginationPerPage={pageSize} onPageChange={setPage} />
      </section>
      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}>
          <form className="admin-product-modal admin-reference-modal" onSubmit={saveCms}>
            <div className="admin-modal-heading">
              <div><p className="admin-eyebrow">{editingId ? 'EDIT CONTENT' : 'NEW CONTENT'}</p><h2>{editingId ? 'Update CMS content' : 'Add CMS content'}</h2></div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog"><Icon name="close" /></button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide"><span>Name</span><input required maxLength={150} value={draft.Name} onChange={(event) => setDraft((current) => ({ ...current, Name: event.target.value }))} placeholder="Content name" /></label>
              <div className="admin-form-field admin-form-wide"><span>Description</span><AdminRichTextEditor value={draft.Description} onChange={(Description) => setDraft((current) => ({ ...current, Description }))} /></div>
              <label className="admin-status-toggle"><input type="checkbox" checked={draft.isActive} onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))} /><span>Active</span></label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Add content'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

