'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { CollectionReference, ProductApiResponse } from '../api/ProductApi';
import api from '../api/axios';
import Header from '../common/header';
import Icon from '../common/icon';

type CollectionType = CollectionReference & {
  isDisplay: boolean;
};

type CollectionTypeInput = {
  collectionName?: string;
  createdBy?: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
};

const emptyDraft = {
  collectionName: '',
  isActive: true,
  isDisplay: true,
};

export default function CollectionTypesPage() {
  const [items, setItems] = useState<CollectionType[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);

  async function loadCollectionTypes() {
    const response = await api.get<ProductApiResponse<CollectionType[]>>('/collection-types/list');
    setItems(response.data.data);
  }

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await api.get<ProductApiResponse<CollectionType[]>>('/collection-types/list');
        if (active) setItems(response.data.data);
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load collection types.');
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
    return items.filter((item) => item.collectionName.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(item: CollectionType) {
    setEditingId(item._id);
    setDraft({
      collectionName: item.collectionName,
      isActive: item.isActive,
      isDisplay: item.isDisplay,
    });
    setModalOpen(true);
  }

  async function saveCollectionType(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const collectionName = draft.collectionName.trim();
    if (!collectionName) return;

    const actor = 'admin';
    const payload: CollectionTypeInput = {
      collectionName,
      updatedBy: actor,
      isActive: draft.isActive,
      isDisplay: draft.isDisplay,
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put<ProductApiResponse<CollectionType>>(
          `/collection-types/update/${encodeURIComponent(editingId)}`,
          payload,
        );
      } else {
        await api.post<ProductApiResponse<CollectionType>>(
          '/collection-types/create',
          { ...payload, createdBy: actor },
        );
      }

      setModalOpen(false);
      setNotice(`Collection type ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      try {
        await loadCollectionTypes();
      } catch (error) {
        setNotice(error instanceof Error
          ? `Saved the collection type, but could not refresh the list: ${error.message}`
          : 'Saved the collection type, but could not refresh the list.');
        setNoticeIsError(true);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the collection type.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCollectionType(item: CollectionType) {
    if (!window.confirm(`Remove "${item.collectionName}" from collection types?`)) return;
    try {
      await api.delete<ProductApiResponse<CollectionType>>(
        `/collection-types/delete/${encodeURIComponent(item._id)}`,
        { data: { updatedBy: 'admin' } },
      );
      setNotice('Collection type removed.');
      setNoticeIsError(false);
      try {
        await loadCollectionTypes();
      } catch (error) {
        setNotice(error instanceof Error
          ? `Removed the collection type, but could not refresh the list: ${error.message}`
          : 'Removed the collection type, but could not refresh the list.');
        setNoticeIsError(true);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the collection type.');
      setNoticeIsError(true);
    }
  }

  return (
    <>
      <Header
        eyebrow="CATALOG MANAGEMENT"
        title="Collection"
        highlight="types"
        subtitle="Manage the collection types available in your catalog."
        action={(
          <button type="button" className="admin-primary-button" onClick={openCreate}>
            <Icon name="plus" size={17} /> Add collection type
          </button>
        )}
      />

      {notice && (
        <div className={`admin-notice ${noticeIsError ? 'admin-notice-error' : ''}`} role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Collection types</h2>
            <p>Manage names, availability, and storefront visibility.</p>
          </div>
          <span className="admin-inventory-count">{items.length} total</span>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'type' : 'types'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search collection types..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search collection types"
            />
          </label>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table admin-reference-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>STOREFRONT</th>
                <th>STATUS</th>
                <th><span className="admin-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((item) => (
                <tr key={item._id}>
                  <td><strong className="admin-reference-name">{item.collectionName}</strong></td>
                  <td>
                    <span className={`admin-reference-status ${item.isDisplay ? 'is-active' : 'is-inactive'}`}>
                      {item.isDisplay ? 'Displayed' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-reference-status ${item.isActive ? 'is-active' : 'is-inactive'}`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => openEdit(item)} aria-label={`Edit ${item.collectionName}`} title="Edit collection type">
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" onClick={() => void deleteCollectionType(item)} aria-label={`Delete ${item.collectionName}`} title="Delete collection type">
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleItems.length === 0 && !loading && (
                <tr>
                  <td className="admin-reference-empty" colSpan={4}>
                    {items.length ? 'No collection types match your search.' : 'No collection types yet. Add one to get started.'}
                  </td>
                </tr>
              )}
              {loading && (
                <tr><td className="admin-reference-empty" colSpan={4}>Loading collection types…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal" onSubmit={saveCollectionType}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">{editingId ? 'EDIT TYPE' : 'NEW TYPE'}</p>
                <h2>{editingId ? 'Update collection type' : 'Add collection type'}</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide">
                <span>Collection type</span>
                <input
                  required
                  maxLength={100}
                  value={draft.collectionName}
                  onChange={(event) => setDraft((current) => ({ ...current, collectionName: event.target.value }))}
                  placeholder="e.g. Premium Collection"
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
              <label className="admin-status-toggle">
                <input
                  type="checkbox"
                  checked={draft.isDisplay}
                  onChange={(event) => setDraft((current) => ({ ...current, isDisplay: event.target.checked }))}
                />
                <span>Display on storefront</span>
              </label>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add type'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}