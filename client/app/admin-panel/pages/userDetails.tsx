'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminToast from '../common/AdminToast';
import { changeUserStatus, getUserList } from '../api/users';
import type { UserMaster } from '../types/User';
import Header from '../common/header';
import Icon from '../common/AdminIcon';
import AdminDataTable from '../common/AdminDataTable';
import type { TableColumn } from 'react-data-table-component';

export default function UserDetailsPage() {
  const [items, setItems] = useState<UserMaster[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [noticeIsError, setNoticeIsError] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getUserList();
        if (active) setItems(response.data.filter((user) => !user.isDeleted));
      } catch (error) {
        if (active) {
          setNotice(error instanceof Error ? error.message : 'Could not load user details.');
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
    return items.filter((user) => (
      `${user.name} ${user.mobile} ${user.email} ${user.address}`.toLowerCase().includes(normalizedQuery)
    ));
  }, [items, query]);

  async function toggleUserStatus(user: UserMaster) {
    setStatusUpdatingId(user._id);
    try {
      const response = await changeUserStatus(user._id, !user.isActive, 'admin');
      setItems((current) => current.map((item) => (
        item._id === user._id ? response.data : item
      )));
      setNotice(`User ${response.data.isActive ? 'activated' : 'inactivated'} successfully.`);
      setNoticeIsError(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update user status.');
      setNoticeIsError(true);
    } finally {
      setStatusUpdatingId(null);
    }
  }

  const columns: TableColumn<UserMaster>[] = [
    {
      name: 'USER',
      minWidth: '220px',
      grow: 2,
      cell: (user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name?.trim() || 'Name not provided'}
            </div>
            <small style={{ color: 'var(--mut, #999)', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </small>
          </div>
        </div>
      ),
    },
    {
      name: 'NUMBER',
      minWidth: '150px',
      selector: (user) => user.mobile?.trim() || '—',
    },
    {
      name: 'ADDRESS',
      minWidth: '220px',
      grow: 2,
      cell: (user) => <span title={user.address || ''}>{user.address?.trim() || '—'}</span>,
    },
    {
      name: 'STATUS',
      minWidth: '120px',
      cell: (user) => (
        <button
          type="button"
          className={`admin-reference-status ${user.isActive ? 'is-active' : 'is-inactive'}`}
          onClick={() => void toggleUserStatus(user)}
          disabled={statusUpdatingId === user._id}
          aria-label={`${user.isActive ? 'Inactivate' : 'Activate'} ${user.name || user.email}`}
        >
          {statusUpdatingId === user._id ? 'Updating…' : (user.isActive ? 'Active' : 'Inactive')}
        </button>
      ),
    },
  ];

  return (
    <>
      <Header
        eyebrow="USER ORDERS"
        title="User"
        highlight="details"
        subtitle="View users who have logged in and manage their account access."
      />

      <AdminToast message={notice} isError={noticeIsError} />

      <section className="admin-inventory-card admin-reference-card">
        <div className="admin-inventory-header">
          <div>
            <h2>User details</h2>
            <p>Name, number, and address of users. Inactive users cannot log in.</p>
          </div>
          <span className="admin-inventory-count">{items.length} total</span>
        </div>
        <div className="admin-toolbar">
          <span className="admin-reference-summary">
            {visibleItems.length} {visibleItems.length === 1 ? 'user' : 'users'}
          </span>
          <label className="admin-search">
            <Icon name="search" size={17} />
            <input
              type="search"
              placeholder="Search users..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search users"
            />
          </label>
        </div>
        <AdminDataTable
          columns={columns}
          data={visibleItems}
          keyField="_id"
          loading={loading}
          emptyMessage={items.length ? 'No users match your search.' : 'No user details found yet.'}
        />
      </section>
    </>
  );
}
