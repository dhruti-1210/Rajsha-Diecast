'use client';

import Icon from './AdminIcon';

type AdminDeleteConfirmProps = {
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function AdminDeleteConfirm({
  itemName,
  onCancel,
  onConfirm,
}: AdminDeleteConfirmProps) {
  return (
    <div
      className="admin-delete-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        className="admin-delete-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-delete-title"
        aria-describedby="admin-delete-message"
      >
        <div className="admin-delete-icon">
          <Icon name="trash" size={40} />
        </div>
        <h2 id="admin-delete-title">Are you sure?</h2>
        <p id="admin-delete-message">
          Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
        </p>
        <div className="admin-delete-actions">
          <button type="button" className="admin-secondary-button" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button type="button" className="admin-delete-button" onClick={onConfirm}>
            <Icon name="trash" size={17} />
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}
