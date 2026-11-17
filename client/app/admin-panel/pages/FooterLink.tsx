'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  changeFooterLinkDisplayStatus,
  changeFooterLinkStatus,
  createFooterLink,
  deleteFooterLink,
  getFooterLinkList,
  updateFooterLink,
} from '../api/footerLink';
import { getFooterLinkGroupList } from '../api/footerLinkGroup';
import type { FooterLink, FooterLinkInput } from '../types/FooterLink';
import type { FooterLinkGroup } from '../types/FooterLinkGroup';
import Header from '../common/header';
import Icon from '../common/icon';

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
  const [items, setItems] = useState<FooterLink[]>([]);
  const [groups, setGroups] = useState<FooterLinkGroup[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<FooterLinkDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);

  async function loadData() {
    const [linksResponse, groupsResponse] = await Promise.all([
      getFooterLinkList(),
      getFooterLinkGroupList(),
    ]);
    setItems(linksResponse.data.filter((link) => !link.isDeleted));
    setGroups(groupsResponse.data.filter((group) => !group.isDeleted));
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [linksResponse, groupsResponse] = await Promise.all([
          getFooterLinkList(),
          getFooterLinkGroupList(),
        ]);
        if (active) {
          setItems(linksResponse.data.filter((link) => !link.isDeleted));
          setGroups(groupsResponse.data.filter((group) => !group.isDeleted));
        }
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load footer links.');
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
    return items.filter((link) => (
      `${link.FooterLinkName} ${link.FooterLinkUrl} ${getGroupName(link.FooterLinkGroupId, groups)}`
        .toLowerCase()
        .includes(normalizedQuery)
    ));
  }, [items, groups, query]);

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

    const actor = 'admin';
    const payload: FooterLinkInput = {
      FooterLinkGroupId: draft.FooterLinkGroupId,
      FooterLinkName,
      FooterLinkUrl,
      updatedBy: actor,
      isActive: draft.isActive,
      isDisplay: draft.isDisplay,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateFooterLink(editingId, payload);
      } else {
        await createFooterLink({ ...payload, createdBy: actor });
      }

      setModalOpen(false);
      setNotice(`Footer link ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      try {
        await loadData();
      } catch (error) {
        setNotice(error instanceof Error
          ? `Saved the footer link, but could not refresh the list: ${error.message}`
          : 'Saved the footer link, but could not refresh the list.');
        setNoticeIsError(true);
      }
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
        ? await changeFooterLinkDisplayStatus(link._id, !link.isDisplay, 'admin')
        : await changeFooterLinkStatus(link._id, !link.isActive, 'admin');
      setItems((current) => current.map((item) => (
        item._id === link._id ? response.data : item
      )));
      const enabled = isDisplay ? response.data.isDisplay : response.data.isActive;
      setNotice(`Footer link ${isDisplay ? 'display' : 'active'} status ${enabled ? 'enabled' : 'disabled'}.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update footer link status.');
      setNoticeIsError(true);
    }
  }

  async function removeFooterLink(link: FooterLink) {
    if (!window.confirm(`Remove "${link.FooterLinkName}"?`)) return;
    try {
      await deleteFooterLink(link._id);
      setItems((current) => current.filter((item) => item._id !== link._id));
      setNotice('Footer link removed.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the footer link.');
      setNoticeIsError(true);
    }
  }

  return (
    <>
      <Header
        eyebrow="STORE CONTENT"
        title="Footer"
        highlight="links"
        subtitle="Manage links and organize them into footer groups."
        action={(
          <button
            type="button"
            className="admin-primary-button"
            onClick={openCreate}
          >
            <Icon name="plus" size={17} /> Add footer link
          </button>
        )}
      />

      {notice && (
        <div className={`admin-notice ${noticeIsError ? 'admin-notice-error' : ''}`} role={noticeIsError ? 'alert' : 'status'}>
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
            <Icon name="close" size={16} />
          </button>
        </div>
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Footer links</h2>
            <p>Each footer link belongs to a group.</p>
          </div>
          <span className="admin-inventory-count">{items.length} total</span>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'link' : 'links'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search footer links..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search footer links"
            />
          </label>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table admin-reference-table">
            <thead>
              <tr>
                <th>LINK NAME</th>
                <th>URL</th>
                <th>GROUP</th>
                <th>STOREFRONT</th>
                <th>STATUS</th>
                <th><span className="admin-visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((link) => (
                <tr key={link._id}>
                  <td><strong className="admin-reference-name">{link.FooterLinkName}</strong></td>
                  <td className="admin-footer-link-url" title={link.FooterLinkUrl}>{link.FooterLinkUrl}</td>
                  <td>{getGroupName(link.FooterLinkGroupId, groups)}</td>
                  <td>
                    <button
                      type="button"
                      className={`admin-reference-status ${link.isDisplay ? 'is-active' : 'is-inactive'}`}
                      onClick={() => void toggleFooterLink(link, true)}
                      aria-label={`${link.isDisplay ? 'Hide' : 'Display'} ${link.FooterLinkName} on storefront`}
                    >
                      {link.isDisplay ? 'Displayed' : 'Hidden'}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`admin-reference-status ${link.isActive ? 'is-active' : 'is-inactive'}`}
                      onClick={() => void toggleFooterLink(link, false)}
                      aria-label={`${link.isActive ? 'Deactivate' : 'Activate'} ${link.FooterLinkName}`}
                    >
                      {link.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => openEdit(link)} aria-label={`Edit ${link.FooterLinkName}`} title="Edit footer link">
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" onClick={() => void removeFooterLink(link)} aria-label={`Delete ${link.FooterLinkName}`} title="Delete footer link">
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visibleItems.length === 0 && !loading && (
                <tr>
                  <td className="admin-reference-empty" colSpan={6}>
                    {items.length ? 'No footer links match your search.' : 'No footer links yet. Add one to get started.'}
                  </td>
                </tr>
              )}
              {loading && (
                <tr><td className="admin-reference-empty" colSpan={6}>Loading footer links…</td></tr>
              )}
            </tbody>
          </table>
        </div>
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
                <a href="#footer-link-groups">Go to footer link groups</a>
              </p>
            )}
            <div className="admin-form-grid">
              <label className="admin-form-field admin-form-wide">
                <span>Footer link group</span>
                <select
                  required
                  value={draft.FooterLinkGroupId}
                  onChange={(event) => setDraft((current) => ({ ...current, FooterLinkGroupId: event.target.value }))}
                >
                  <option value="">Select a group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.FooterLinkGroupName}{group.isActive ? '' : ' (Inactive)'}
                    </option>
                  ))}
                </select>
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
