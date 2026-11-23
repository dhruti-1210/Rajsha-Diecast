'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminSelect from '../common/AdminSelect';
import AdminToast from '../common/AdminToast';
import AdminDataTable from '../common/AdminDataTable';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import {
  changeFooterLinkDisplayStatus,
  changeFooterLinkStatus,
  createFooterLink,
  deleteFooterLink,
  getFooterLinkList,
  updateFooterLink,
} from '../api/footerLink';
import { getFooterLinkGroupList } from '../api/footerLinkGroup';
import { useAdminList } from '../hooks/useAdminList';
import type { FooterLink, FooterLinkInput } from '../types/FooterLink';
import type { FooterLinkGroup } from '../types/FooterLinkGroup';
import type { TableColumn } from 'react-data-table-component';

type FooterLinkDraft = {
  FooterLinkGroupId: string;
  FooterLinkName: string;
  FooterLinkUrl: string;
  isActive: boolean;
  isDisplay: boolean;
};

const emptyDraft: FooterLinkDraft = {
  FooterLinkGroupId: '',
  FooterLinkName: '',
  FooterLinkUrl: '',
  isActive: true,
  isDisplay: true,
};

function getGroupId(value: FooterLink['FooterLinkGroupId']) {
  return typeof value === 'string' ? value : value?._id ?? '';
}

function getGroupName(
  value: FooterLink['FooterLinkGroupId'],
  groups: FooterLinkGroup[],
) {
  if (typeof value !== 'string' && value?.FooterLinkGroupName) return value.FooterLinkGroupName;
  return groups.find((group) => group._id === getGroupId(value))?.FooterLinkGroupName ?? 'Unknown group';
}

export default function FooterLinkPage() {
  const list = useAdminList<FooterLink>(getFooterLinkList, { pageSize: 10 });
  const [groups, setGroups] = useState<FooterLinkGroup[]>([]);
  const [draft, setDraft] = useState<FooterLinkDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<FooterLink | null>(null);

  async function loadGroups() {
    try {
      const res = await getFooterLinkGroupList({ all: true });
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch {
      // non-fatal for list view; form will show warning if none
    }
  }

  useEffect(() => {
    void loadGroups();
  }, []);

  useEffect(() => {
    if (list.error) {
      setNotice(list.error);
      setNoticeIsError(true);
    }
  }, [list.error]);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(link: FooterLink) {
    setEditingId(link._id);
    setDraft({
      FooterLinkGroupId: getGroupId(link.FooterLinkGroupId),
      FooterLinkName: link.FooterLinkName,
      FooterLinkUrl: link.FooterLinkUrl,
      isActive: link.isActive,
      isDisplay: link.isDisplay,
    });
    setModalOpen(true);
  }

  async function saveFooterLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const FooterLinkName = draft.FooterLinkName.trim();
    const FooterLinkUrl = draft.FooterLinkUrl.trim();
    if (!draft.FooterLinkGroupId || !FooterLinkName || !FooterLinkUrl) return;

    const payload: FooterLinkInput = {
      FooterLinkGroupId: draft.FooterLinkGroupId,
      FooterLinkName,
      FooterLinkUrl,
      isActive: draft.isActive,
      isDisplay: draft.isDisplay,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateFooterLink(editingId, payload);
      } else {
        await createFooterLink(payload);
      }
      setModalOpen(false);
      setNotice(`Footer link ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      await Promise.all([list.refresh(), loadGroups()]);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the footer link.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleFooterLink(link: FooterLink, isDisplay: boolean) {
    try {
      const response = isDisplay
        ? await changeFooterLinkDisplayStatus(link._id, !link.isDisplay)
        : await changeFooterLinkStatus(link._id, !link.isActive);
      const enabled = isDisplay ? response.data.isDisplay : response.data.isActive;
      setNotice(`Footer link ${isDisplay ? 'display' : 'active'} status ${enabled ? 'enabled' : 'disabled'}.`);
      setNoticeIsError(false);
      await list.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update footer link status.');
      setNoticeIsError(true);
    }
  }

  async function removeFooterLink(link: FooterLink) {
    try {
      await deleteFooterLink(link._id);
      setNotice('Footer link removed.');
      setNoticeIsError(false);
      await list.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the footer link.');
      setNoticeIsError(true);
    }
  }

  const groupOptions = useMemo(() => groups.map((group) => ({
    value: group._id,
    label: `${group.FooterLinkGroupName}${group.isActive ? '' : ' (Inactive)'}`,
  })), [groups]);

  const columns: TableColumn<FooterLink>[] = [
    { name: 'LINK NAME', selector: (link) => link.FooterLinkName, minWidth: '130px', wrap: true },
    {
      name: 'URL',
      minWidth: '180px',
      grow: 1.5,
      cell: (link) => <span className="admin-footer-link-url" title={link.FooterLinkUrl}>{link.FooterLinkUrl}</span>,
    },
    {
      name: 'GROUP',
      minWidth: '120px',
      selector: (link) => getGroupName(link.FooterLinkGroupId, groups),
      wrap: true,
    },
    {
      name: 'STOREFRONT',
      minWidth: '120px',
      cell: (link) => (
        <button
          type="button"
          className={`admin-reference-status ${link.isDisplay ? 'is-active' : 'is-inactive'}`}
          onClick={() => void toggleFooterLink(link, true)}
          aria-label={`${link.isDisplay ? 'Hide' : 'Display'} ${link.FooterLinkName} on storefront`}
        >
          {link.isDisplay ? 'Displayed' : 'Hidden'}
        </button>
      ),
    },
    {
      name: 'STATUS',
      minWidth: '100px',
      cell: (link) => (
        <button
          type="button"
          className={`admin-reference-status ${link.isActive ? 'is-active' : 'is-inactive'}`}
          onClick={() => void toggleFooterLink(link, false)}
          aria-label={`${link.isActive ? 'Deactivate' : 'Activate'} ${link.FooterLinkName}`}
        >
          {link.isActive ? 'Active' : 'Inactive'}
        </button>
      ),
    },
    {
      name: 'ACTIONS',
      width: '110px',
      right: true,
      cell: (link) => (
        <div className="admin-row-actions">
          <button type="button" onClick={() => openEdit(link)} aria-label={`Edit ${link.FooterLinkName}`} title="Edit footer link">
            <Icon name="edit" size={16} />
          </button>
          <button type="button" onClick={() => setDeleteTarget(link)} aria-label={`Delete ${link.FooterLinkName}`} title="Delete footer link">
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
        title="Footer"
        highlight="links"
        subtitle="Manage links and organize them into footer groups."
      />

      <AdminToast message={notice} isError={noticeIsError} />
      {deleteTarget && (
        <AdminDeleteConfirm
          itemName={deleteTarget.FooterLinkName}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            if (!target) return;
            setDeleteTarget(null);
            void removeFooterLink(target);
          }}
        />
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Footer links</h2>
            <p>Each footer link belongs to a group.</p>
          </div>
          <button type="button" className="admin-primary-button" onClick={openCreate}>
            <Icon name="plus" size={17} /> Add footer link
          </button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {list.total} {list.total === 1 ? 'link' : 'links'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search footer links..."
              value={list.search}
              onChange={(event) => list.setSearch(event.target.value)}
              aria-label="Search footer links"
            />
          </label>
        </div>
        <AdminDataTable
          columns={columns}
          data={list.items}
          keyField="_id"
          loading={list.loading}
          emptyMessage={list.search ? 'No footer links match your search.' : 'No footer links yet. Add one to get started.'}
          serverPagination
          totalRows={list.total}
          currentPage={list.page}
          onPageChange={list.setPage}
          paginationPerPage={list.pageSize}
        />
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal" onSubmit={saveFooterLink}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">{editingId ? 'EDIT FOOTER LINK' : 'NEW FOOTER LINK'}</p>
                <h2>{editingId ? 'Update footer link' : 'Add footer link'}</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            {groups.length === 0 && (
              <p className="admin-reference-warning">
                Create a footer link group before adding a link.{' '}
                <a href="/admin-panel/footer-link-groups">Go to footer link groups</a>
              </p>
            )}
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide">
                <span>Footer link group</span>
                <AdminSelect
                  required
                  value={draft.FooterLinkGroupId}
                  placeholder="Select a group"
                  onChange={(value) => setDraft((current) => ({ ...current, FooterLinkGroupId: value }))}
                  options={groupOptions}
                />
              </label>
              <label className="admin-form-field admin-form-wide">
                <span>Link name</span>
                <input
                  required
                  maxLength={150}
                  value={draft.FooterLinkName}
                  onChange={(event) => setDraft((current) => ({ ...current, FooterLinkName: event.target.value }))}
                  placeholder="e.g. Contact us"
                />
              </label>
              <label className="admin-form-field admin-form-wide">
                <span>Link URL</span>
                <input
                  required
                  maxLength={500}
                  value={draft.FooterLinkUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, FooterLinkUrl: event.target.value }))}
                  placeholder="/contact or https://example.com"
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
              <button type="submit" className="admin-primary-button" disabled={saving || groups.length === 0}>
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add footer link'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
