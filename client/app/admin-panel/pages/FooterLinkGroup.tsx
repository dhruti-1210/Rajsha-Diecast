'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import {
  changeFooterLinkGroupStatus,
  createFooterLinkGroup,
  deleteFooterLinkGroup,
  getFooterLinkGroupList,
  updateFooterLinkGroup,
} from '../api/footerLinkGroup';
import type { FooterLinkGroup, FooterLinkGroupInput } from '../types/FooterLinkGroup';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';

type FooterLinkGroupDraft = {
  FooterLinkGroupName: string;
  isActive: boolean;
  isDisplay: boolean;
};

const emptyDraft: FooterLinkGroupDraft = {
  FooterLinkGroupName: '',
  isActive: true,
  isDisplay: true,
};

export default function FooterLinkGroupPage() {
  const [items, setItems] = useState<FooterLinkGroup[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<FooterLinkGroupDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FooterLinkGroup | null>(null);

  async function loadGroups() {
    setLoading(true);
    try {
      const response = await getFooterLinkGroupList();
      setItems(response.data.filter((group) => !group.isDeleted));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getFooterLinkGroupList();
        if (active) setItems(response.data.filter((group) => !group.isDeleted));
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load footer link groups.');
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
    return items.filter((group) => group.FooterLinkGroupName.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(group: FooterLinkGroup) {
    setEditingId(group._id);
    setDraft({
      FooterLinkGroupName: group.FooterLinkGroupName,
      isActive: group.isActive,
      isDisplay: group.isDisplay,
    });
    setModalOpen(true);
  }

  async function saveGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const FooterLinkGroupName = draft.FooterLinkGroupName.trim();
    if (!FooterLinkGroupName) return;

    const actor = 'admin';
    const payload: FooterLinkGroupInput = {
      FooterLinkGroupName,
      updatedBy: actor,
      isActive: draft.isActive,
      isDisplay: draft.isDisplay,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateFooterLinkGroup(editingId, payload);
      } else {
        await createFooterLinkGroup({ ...payload, createdBy: actor });
      }

      setModalOpen(false);
      setNotice(`Footer link group ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      try {
        await loadGroups();
      } catch (error) {
        setNotice(error instanceof Error
          ? `Saved the group, but could not refresh the list: ${error.message}`
          : 'Saved the group, but could not refresh the list.');
        setNoticeIsError(true);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the footer link group.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleGroupStatus(group: FooterLinkGroup, isDisplay: boolean) {
    try {
      const response = isDisplay
        ? await updateFooterLinkGroup(group._id, {
          isDisplay: !group.isDisplay,
          updatedBy: 'admin',
        })
        : await changeFooterLinkGroupStatus(group._id, !group.isActive, 'admin');
      setItems((current) => current.map((item) => (
        item._id === group._id ? response.data : item
      )));
      const enabled = isDisplay ? response.data.isDisplay : response.data.isActive;
      setNotice(`Footer link group ${isDisplay ? 'display' : 'active'} status ${enabled ? 'enabled' : 'disabled'}.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update footer link group status.');
      setNoticeIsError(true);
    }
  }

  async function removeGroup(group: FooterLinkGroup) {
    try {
      await deleteFooterLinkGroup(group._id, 'admin');
      setItems((current) => current.filter((item) => item._id !== group._id));
      setNotice('Footer link group removed.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the footer link group.');
      setNoticeIsError(true);
    }
  }

  const columns: TableColumn<FooterLinkGroup>[] = [
    { name: 'GROUP NAME', selector: (group) => group.FooterLinkGroupName, grow: 2, wrap: true },
    {
      name: 'STOREFRONT',
      minWidth: '120px',
      cell: (group) => (
        <button
          type="button"
          className={`admin-reference-status ${group.isDisplay ? 'is-active' : 'is-inactive'}`}
          onClick={() => void toggleGroupStatus(group, true)}
          aria-label={`${group.isDisplay ? 'Hide' : 'Display'} ${group.FooterLinkGroupName} on storefront`}
        >
          {group.isDisplay ? 'Displayed' : 'Hidden'}
        </button>
      ),
    },
    {
      name: 'STATUS',
      minWidth: '100px',
      cell: (group) => (
        <button
          type="button"
          className={`admin-reference-status ${group.isActive ? 'is-active' : 'is-inactive'}`}
          onClick={() => void toggleGroupStatus(group, false)}
          aria-label={`${group.isActive ? 'Deactivate' : 'Activate'} ${group.FooterLinkGroupName}`}
        >
          {group.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      name: 'ACTIONS',
      width: '110px',
      right: true,
      cell: (group) => (
        <div className="admin-row-actions">
          <button type="button" onClick={() => openEdit(group)} aria-label={`Edit ${group.FooterLinkGroupName}`} title="Edit group">
            <Icon name="edit" size={16} />
          </button>
          <button type="button" onClick={() => setDeleteTarget(group)} aria-label={`Delete ${group.FooterLinkGroupName}`} title="Delete group">
            <Icon name="trash" size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header
        eyebrow="STORE CONTENT"
        title="Footer link"
        highlight="groups"
        subtitle="Organize storefront footer links into manageable groups."
      />

      <AdminToast message={notice} isError={noticeIsError} />
      {deleteTarget && (
        <AdminDeleteConfirm
          itemName={deleteTarget.FooterLinkGroupName}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            if (!target) return;
            setDeleteTarget(null);
            void removeGroup(target);
          }}
        />
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Footer link groups</h2>
            <p>Create groups before adding links to the storefront footer.</p>
          </div>
          <button type="button" className="admin-primary-button" onClick={openCreate}>
            <Icon name="plus" size={17} /> Add group
          </button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'group' : 'groups'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search footer groups..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search footer link groups"
            />
          </label>
        </div>
        <AdminDataTable
          columns={columns}
          data={visibleItems}
          keyField="_id"
          loading={loading}
          emptyMessage={items.length ? 'No groups match your search.' : 'No footer link groups yet. Add one to get started.'}
        />
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal" onSubmit={saveGroup}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">{editingId ? 'EDIT GROUP' : 'NEW GROUP'}</p>
                <h2>{editingId ? 'Update footer link group' : 'Add footer link group'}</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide">
                <span>Group name</span>
                <input
                  required
                  maxLength={120}
                  value={draft.FooterLinkGroupName}
                  onChange={(event) => setDraft((current) => ({ ...current, FooterLinkGroupName: event.target.value }))}
                  placeholder="e.g. Customer service"
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
              {/* <label className="admin-status-toggle">
                <input
                  type="checkbox"
                  checked={draft.isDisplay}
                  onChange={(event) => setDraft((current) => ({ ...current, isDisplay: event.target.checked }))}
                />
                <span>Display on storefront</span>
              </label> */}
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="admin-secondary-button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="admin-primary-button" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add group'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
