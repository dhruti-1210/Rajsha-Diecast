'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import AdminDeleteConfirm from '../common/AdminDeleteConfirm';
import AdminToast from '../common/AdminToast';
import {
  changeBannerStatus,
  createBanner,
  deleteBanner,
  getBannerList,
  updateBanner,
} from '../api/banner';
import type { Banner, BannerInput } from '../types/banner';
import Header from '../common/header';
import Icon from '../common/icon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';
import { readImageAsDataUrl } from '../utils/images';

const MAX_BANNER_FILE_SIZE = 5 * 1024 * 1024;

type BannerDraft = {
  BannerImg: string;
  BannerTitle: string;
  BannerSubTitle: string;
  isActive: boolean;
};

const emptyDraft: BannerDraft = {
  BannerImg: '',
  BannerTitle: '',
  BannerSubTitle: '',
  isActive: true,
};

export default function BannerPage() {
  const [items, setItems] = useState<Banner[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<BannerDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  async function loadBanners() {
    setLoading(true);
    try {
      const response = await getBannerList();
      setItems(response.data.filter((banner) => !banner.isDeleted));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getBannerList();
        if (active) setItems(response.data.filter((banner) => !banner.isDeleted));
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load banners.');
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
    return items.filter((banner) => (
      `${banner.BannerTitle} ${banner.BannerSubTitle}`.toLowerCase().includes(normalizedQuery)
    ));
  }, [items, query]);

  function openCreate() {
    setEditingId(null);
    setDraft(emptyDraft);
    setModalOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditingId(banner._id);
    setDraft({
      BannerImg: banner.BannerImg,
      BannerTitle: banner.BannerTitle,
      BannerSubTitle: banner.BannerSubTitle,
      isActive: banner.isActive,
    });
    setModalOpen(true);
  }

  async function selectBannerImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotice('Choose an image file for the banner.');
      setNoticeIsError(true);
      return;
    }
    if (file.size > MAX_BANNER_FILE_SIZE) {
      setNotice('Choose a banner image smaller than 5 MB.');
      setNoticeIsError(true);
      return;
    }

    try {
      const BannerImg = await readImageAsDataUrl(file);
      setDraft((current) => ({ ...current, BannerImg }));
      setNotice('');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load the banner image.');
      setNoticeIsError(true);
    }
  }

  async function saveBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const BannerTitle = draft.BannerTitle.trim();
    const BannerSubTitle = draft.BannerSubTitle.trim();
    if (!BannerTitle || !BannerSubTitle || !draft.BannerImg) {
      setNotice('Add a title, subtitle, and banner image before saving.');
      setNoticeIsError(true);
      return;
    }

    const actor = 'admin';
    const values = {
      BannerImg: draft.BannerImg,
      BannerTitle,
      BannerSubTitle,
      updatedBy: actor,
      isActive: draft.isActive,
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateBanner(editingId, values);
      } else {
        const payload: BannerInput = { ...values, createdBy: actor };
        await createBanner(payload);
      }

      setModalOpen(false);
      setNotice(`Banner ${editingId ? 'updated' : 'added'}.`);
      setNoticeIsError(false);
      try {
        await loadBanners();
      } catch (error) {
        setNotice(error instanceof Error
          ? `Saved the banner, but could not refresh the list: ${error.message}`
          : 'Saved the banner, but could not refresh the list.');
        setNoticeIsError(true);
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save the banner.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  async function toggleBannerStatus(banner: Banner) {
    try {
      const response = await changeBannerStatus(banner._id, !banner.isActive, 'admin');
      setItems((current) => current.map((item) => (
        item._id === banner._id ? response.data : item
      )));
      setNotice(`Banner ${response.data.isActive ? 'activated' : 'deactivated'}.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update banner status.');
      setNoticeIsError(true);
    }
  }

  async function removeBanner(banner: Banner) {
    try {
      await deleteBanner(banner._id, 'admin');
      setItems((current) => current.filter((item) => item._id !== banner._id));
      setNotice('Banner removed.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not remove the banner.');
      setNoticeIsError(true);
    }
  }

  const columns: TableColumn<Banner>[] = [
    {
      name: 'IMAGE',
      width: '110px',
      cell: (banner) => (
        <img className="admin-banner-thumbnail" src={banner.BannerImg} alt={banner.BannerTitle} />
      ),
    },
    { name: 'TITLE', selector: (banner) => banner.BannerTitle, minWidth: '140px', grow: 1.5, wrap: true },
    { name: 'SUBTITLE', selector: (banner) => banner.BannerSubTitle, minWidth: '180px', grow: 2, wrap: true },
    {
      name: 'STATUS',
      minWidth: '100px',
      cell: (banner) => (
        <span className={`admin-reference-status ${banner.isActive ? 'is-active' : 'is-inactive'}`}>
          {banner.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      name: 'ACTIONS',
      width: '150px',
      right: true,
      cell: (banner) => (
        <div className="admin-row-actions">
          <button
            type="button"
            onClick={() => void toggleBannerStatus(banner)}
            aria-label={`${banner.isActive ? 'Deactivate' : 'Activate'} ${banner.BannerTitle}`}
            title={banner.isActive ? 'Deactivate banner' : 'Activate banner'}
          >
            <Icon name="box" size={16} />
          </button>
          <button type="button" onClick={() => openEdit(banner)} aria-label={`Edit ${banner.BannerTitle}`} title="Edit banner">
            <Icon name="edit" size={16} />
          </button>
          <button type="button" onClick={() => setDeleteTarget(banner)} aria-label={`Delete ${banner.BannerTitle}`} title="Delete banner">
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
        title="Banner"
        highlight="images"
        subtitle="Manage banner artwork and text shown across the storefront."
      />

      <AdminToast message={notice} isError={noticeIsError} />
      {deleteTarget && (
        <AdminDeleteConfirm
          itemName={deleteTarget.BannerTitle}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            if (!target) return;
            setDeleteTarget(null);
            void removeBanner(target);
          }}
        />
      )}

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>Banner images</h2>
            <p>Upload an image and manage its storefront title and subtitle.</p>
          </div>
          <button type="button" className="admin-primary-button" onClick={openCreate}>
            <Icon name="plus" size={17} /> Add banner
          </button>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'banner' : 'banners'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search banners..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search banners"
            />
          </label>
        </div>
        <AdminDataTable
          columns={columns}
          data={visibleItems}
          keyField="_id"
          loading={loading}
          emptyMessage={items.length ? 'No banners match your search.' : 'No banners yet. Add one to get started.'}
        />
      </section>

      {modalOpen && (
        <div className="admin-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}>
          <form className="admin-product-modal" onSubmit={saveBanner}>
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">{editingId ? 'EDIT BANNER' : 'NEW BANNER'}</p>
                <h2>{editingId ? 'Update banner' : 'Add banner'}</h2>
              </div>
              <button type="button" className="admin-modal-close" onClick={() => setModalOpen(false)} aria-label="Close dialog">
                <Icon name="close" />
              </button>
            </div>
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-wide">
                <span>Banner image</span>
                {draft.BannerImg ? (
                  <div className="admin-banner-image-preview">
                    <img src={draft.BannerImg} alt="Banner preview" />
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => imageFileInputRef.current?.click()}
                    >
                      Change image
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="admin-add-image"
                    onClick={() => imageFileInputRef.current?.click()}
                  >
                    <Icon name="plus" size={15} /> Choose image
                  </button>
                )}
                <input
                  ref={imageFileInputRef}
                  className="admin-image-file-input"
                  type="file"
                  accept="image/*"
                  aria-label="Upload banner image"
                  onChange={(event) => void selectBannerImage(event)}
                />
              </div>
              <label className="admin-form-field admin-form-wide">
                <span>Banner title</span>
                <input
                  required
                  maxLength={150}
                  value={draft.BannerTitle}
                  onChange={(event) => setDraft((current) => ({ ...current, BannerTitle: event.target.value }))}
                  placeholder="Banner title"
                />
              </label>
              <label className="admin-form-field admin-form-wide">
                <span>Banner subtitle</span>
                <input
                  required
                  maxLength={250}
                  value={draft.BannerSubTitle}
                  onChange={(event) => setDraft((current) => ({ ...current, BannerSubTitle: event.target.value }))}
                  placeholder="Banner subtitle"
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
                {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add banner'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
