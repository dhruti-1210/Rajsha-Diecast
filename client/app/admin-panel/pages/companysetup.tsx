'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import AdminToast from '../common/AdminToast';
import {
  createCompanySetup,
  getCompanySetupList,
  updateCompanySetup,
} from '../api/companySetup';
import { COMPANY_SETUP_UPDATED_EVENT } from '@/api/CompanySetupApi';
import type { CompanySetup, CompanySetupInput } from '@/types/CompanySetup';
import { readImageAsDataUrl } from '../utils/images';

const MAX_COMPANY_LOGO_FILE_SIZE = 5 * 1024 * 1024;

type CompanySetupDraft = {
  CompanyName: string;
  companyLogo: string;
  ShippingCharges: number;
  FreeShippingCharge: number;
  OnlyNLeft: number;
  isActive: boolean;
  isDisplay: boolean;
};

const emptyDraft: CompanySetupDraft = {
  CompanyName: '',
  companyLogo: '',
  ShippingCharges: 0,
  FreeShippingCharge: 0,
  OnlyNLeft: 0,
  isActive: true,
  isDisplay: false,
};

function toDraft(setup: CompanySetup): CompanySetupDraft {
  return {
    CompanyName: setup.CompanyName,
    companyLogo: setup.companyLogo,
    ShippingCharges: setup.ShippingCharges,
    FreeShippingCharge: setup.FreeShippingCharge,
    OnlyNLeft: setup.OnlyNLeft,
    isActive: setup.isActive,
    isDisplay: setup.isDisplay,
  };
}

export default function CompanySetupPage() {
  const [setupId, setSetupId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CompanySetupDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;

    async function loadCompanySetup() {
      try {
        const response = await getCompanySetupList();
        const availableSetups = response.data.filter((item) => !item.isDeleted);
        const setup = availableSetups.find((item) => item.isActive) ?? availableSetups[0];
        if (active && setup) {
          setSetupId(setup._id);
          setDraft(toDraft(setup));
        }
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load company setup.');
          setNoticeIsError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadCompanySetup();
    return () => { active = false; };
  }, []);

  async function selectCompanyLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setNotice('Choose an image file for the company logo.');
      setNoticeIsError(true);
      return;
    }
    if (file.size > MAX_COMPANY_LOGO_FILE_SIZE) {
      setNotice('Choose a company logo smaller than 5 MB.');
      setNoticeIsError(true);
      return;
    }

    try {
      const companyLogo = await readImageAsDataUrl(file);
      setDraft((current) => ({ ...current, companyLogo }));
      setNotice('');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load the company logo.');
      setNoticeIsError(true);
    }
  }

  async function saveCompanySetup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const CompanyName = draft.CompanyName.trim();
    const companyLogo = draft.companyLogo.trim();
    if (!CompanyName) return;
    if (!companyLogo) {
      setNotice('Choose a company logo image before saving.');
      setNoticeIsError(true);
      return;
    }

    const actor = 'admin';
    const values = {
      CompanyName,
      companyLogo,
      ShippingCharges: draft.ShippingCharges,
      FreeShippingCharge: draft.FreeShippingCharge,
      OnlyNLeft: draft.OnlyNLeft,
      updatedBy: actor,
      isActive: draft.isActive,
      isDisplay: draft.isDisplay,
    };

    setSaving(true);
    setNotice('');
    try {
      const response = setupId
        ? await updateCompanySetup(setupId, values)
        : await createCompanySetup({ ...values, createdBy: actor } satisfies CompanySetupInput);
      setSetupId(response.data._id);
      setDraft(toDraft(response.data));
      window.dispatchEvent(new Event(COMPANY_SETUP_UPDATED_EVENT));
      setNotice('Company settings saved.');
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save company settings.');
      setNoticeIsError(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="company-setup-page">
      <section className="company-setup-card">
        <div className="company-setup-banner">
          <small>STORE SETTINGS</small>
          <h1>{draft.CompanyName || 'Company setup'}</h1>
          <span>Update your company details below</span>
        </div>

        {loading ? (
          <p className="company-setup-message" role="status">Loading company settings…</p>
        ) : (
          <form onSubmit={saveCompanySetup}>
            <div className="company-setup-grid">
              <label className="company-setup-field">
                <small>Company name</small>
                <input
                  required
                  maxLength={150}
                  value={draft.CompanyName}
                  onChange={(event) => setDraft((current) => ({ ...current, CompanyName: event.target.value }))}
                  placeholder="Company name"
                />
              </label>
              <div className="company-setup-field">
                <small>Company logo</small>
                <div className="company-setup-logo-control">
                  {draft.companyLogo ? (
                    <img src={draft.companyLogo} alt="Company logo preview" />
                  ) : (
                    <span className="company-setup-logo-placeholder">Select a logo image</span>
                  )}
                  <input
                    ref={logoFileInputRef}
                    className="company-setup-file-input"
                    type="file"
                    accept="image/*"
                    aria-label="Upload company logo"
                    onChange={(event) => void selectCompanyLogo(event)}
                  />
                  <div className="company-setup-logo-actions">
                    <button type="button" className="admin-secondary-button" onClick={() => logoFileInputRef.current?.click()}>
                      Choose image
                    </button>
                    {draft.companyLogo && (
                      <button
                        type="button"
                        className="company-setup-remove-logo"
                        onClick={() => setDraft((current) => ({ ...current, companyLogo: '' }))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <label className="company-setup-field">
                <small>Shipping charges</small>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.ShippingCharges}
                  onChange={(event) => setDraft((current) => ({ ...current, ShippingCharges: Number(event.target.value) }))}
                />
              </label>
              <label className="company-setup-field">
                <small>Free shipping from</small>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={draft.FreeShippingCharge}
                  onChange={(event) => setDraft((current) => ({ ...current, FreeShippingCharge: Number(event.target.value) }))}
                />
              </label>
              <label className="company-setup-field">
                <small>Low-stock warning quantity</small>
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={draft.OnlyNLeft}
                  onChange={(event) => setDraft((current) => ({ ...current, OnlyNLeft: Number(event.target.value) }))}
                />
              </label>
              <div className="company-setup-options">
                <label>
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))}
                  />
                  <span>Active</span>
                </label>
                {/* <label>
                  <input
                    type="checkbox"
                    checked={draft.isDisplay}
                    onChange={(event) => setDraft((current) => ({ ...current, isDisplay: event.target.checked }))}
                  />
                  <span>Display on storefront</span>
                </label> */}
              </div>
            </div>

            <AdminToast message={notice} isError={noticeIsError} />

            <div className="company-setup-actions">
              <button type="submit" className="admin-primary-button" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}
