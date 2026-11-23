'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import {
  changeScaleSizeStatus,
  createScaleSize,
  deleteScaleSize,
  getScaleSizeList,
  updateScaleSize,
} from '../api/scaleSize';
import type { ScaleSize, ScaleSizeInput } from '../types/ScaleSize';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';

type ScaleSizeDraft = {
  ScaleSize: string;
  isActive: boolean;
};

const emptyDraft: ScaleSizeDraft = {
  ScaleSize: '',
  isActive: true,
};

export default function ScaleSizesPage() {
  const [items, setItems] = useState<ScaleSize[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<ScaleSizeDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ScaleSize | null>(null);

  async function loadScaleSizes() {
    setLoading(true);
    try {
      const response = await getScaleSizeList();
      setItems(response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getScaleSizeList();
        if (active) setItems(response.data);
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load scale sizes.');
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
    return items.filter((item) => item.ScaleSize.toLowerCase().includes(normalizedQuery));
  }, [items, query]);
  const columns: TableColumn<(typeof visibleItems)[number]>[] = [
    { name: 'SCALE SIZE', selector: (item) => item.ScaleSize, grow: 2, wrap: true },
    {
      name: 'STATUS',
      minWidth: '100px',
      cell: (item) => (
        <span className={`admin-reference-status ${item.isActive ? 'is-active' : 'is-inactive'}`}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      name: 'ACTIONS',
      width: '150px',
      right: true,
      cell: (item) => (
        <div className="admin-row-actions">
          {/* <button
            type="button"
            onClick={() => void toggleScaleSize(item)}
            aria-label={`${item.isActive ? 'Deactivate' : 'Activate'} ${item.ScaleSize}`}
            title={item.isActive ? 'Deactivate scale size' : 'Activate scale size'}
          >
            <Icon name="box" size={16} />
          </button> */}
          <button type="button" onClick={() => openEdit(item)} aria-label={`Edit ${item.ScaleSize}`} title="Edit scale size">
            <Icon name="edit" size={16} />
          </button>
          <button type="button" onClick={() => setDeleteTarget(item)} aria-label={`Delete ${item.ScaleSize}`} title="Delete scale size">
            <Icon name="trash" size={16} />
          </button>
        </div>
      ),
    },
  ];

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(item: ScaleSize) {
    setEditingId(item._id);
    setDraft({ ScaleSize: item.ScaleSize, isActive: item.isActive });
    setModalOpen(true);
  }

  async function saveScaleSize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = draft.ScaleSize.trim();
    if (!value) return;

    const actor = 'admin';
    const payload = {
      ScaleSize: value,
      updatedBy: actor,
      isActive: draft.isActive,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateScaleSize(editingId, payload);
      } else {
        const createPayload: ScaleSizeInput = { ...payload, createdBy: actor };
        await createScaleSize(createPayload);
      }

      setModalOpen(false);
      setNotice(`Scale size ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      try {
        await loadScaleSizes();
      } catch (error) {
        setNotice(error instanceof Error
          ? `Saved the scale size, but could not refresh the list: ${error.message}`
          : 'Saved the scale size, but could not refresh the list.');
        setNoticeIsError(true);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the scale size.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleScaleSize(item: ScaleSize) {
    try {
      const response = await changeScaleSizeStatus(item._id, !item.isActive, 'admin');
      setItems((current) => current.map((scaleSize) => (
        scaleSize._id === item._id ? response.data : scaleSize
      )));
      setNotice(`Scale size ${response.data.isActive ? 'activated' : 'deactivated'}.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update scale size status.');
      setNoticeIsError(true);
    }
  }

  async function removeScaleSize(item: ScaleSize) {
    try {
      await deleteScaleSize(item._id, 'admin');
      setItems((current) => current.filter((scaleSize) => scaleSize._id !== item._id));
      setNotice('Scale size removed.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the scale size.');
      setNoticeIsError(true);
    }
  }

  return (
    <>
      <Header
        eyebrow="CATALOG MANAGEMENT"
        title="Scale"
        highlight="sizes"
        subtitle="Manage the scale options available for catalog products."
      />

      <AdminToast message={notice} isError={noticeIsError} />
      {deleteTarget && (
        <AdminDeleteConfirm
          itemName={deleteTarget.ScaleSize}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            if (!target) return;
            setDeleteTarget(null);
            void removeScaleSize(target);
          }}
        />
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Scale sizes</h2>
            <p>Manage the scale values used across your product catalog.</p>
          </div>
          <button type="button" className="admin-primary-button" onClick={openCreate}>
            <Icon name="plus" size={17} /> Add scale size
          </button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'scale size' : 'scale sizes'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search scale sizes..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search scale sizes"
            />
          </label>
        </div>
        <AdminDataTable
          columns={columns}
          data={visibleItems}
          keyField="_id"
          loading={loading}
          emptyMessage={items.length ? 'No scale sizes match your search.' : 'No scale sizes yet. Add one to get started.'}
        />
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal" onSubmit={saveScaleSize}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">{editingId ? 'EDIT SCALE' : 'NEW SCALE'}</p>
                <h2>{editingId ? 'Update scale size' : 'Add scale size'}</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide">
                <span>Scale size</span>
                <input
                  required
                  maxLength={50}
                  value={draft.ScaleSize}
                  onChange={(event) => setDraft((current) => ({ ...current, ScaleSize: event.target.value }))}
                  placeholder="e.g. 1:64"
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
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add scale size'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
