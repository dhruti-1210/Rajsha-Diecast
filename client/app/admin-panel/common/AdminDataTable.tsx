'use client';

import { useEffect, useState } from 'react';
import DataTable, {
  type TableColumn,
  type TableStyles,
} from 'react-data-table-component';
import Icon from './AdminIcon';

const DEFAULT_PAGE_SIZE = 10;

const customStyles: TableStyles = {
  table: {
    style: {
      backgroundColor: 'transparent',
      color: '#f0e2c7',
      fontFamily: 'inherit',
    },
  },
  responsiveWrapper: {
    style: {
      width: '100%',
      maxWidth: '100%',
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
    },
  },
  headRow: {
    style: {
      minHeight: '42px',
      backgroundColor: '#241e14',
      borderBottom: '1px solid #66502b',
    },
  },
  headCells: {
    style: {
      padding: '9px 12px',
      color: '#c9b486',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '.9px',
      whiteSpace: 'normal',
    },
  },
  rows: {
    style: {
      minHeight: '52px',
      backgroundColor: '#191611',
      borderBottom: '1px solid #403522',
      color: '#e4d5b6',
    },
  },
  cells: {
    style: {
      padding: '9px 12px',
      color: '#e4d5b6',
      fontSize: '12px',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
    },
  },
  noData: {
    style: {
      minHeight: '88px',
      backgroundColor: '#191611',
      color: '#b6a27d',
      fontSize: '12px',
    },
  },
  progress: {
    style: {
      minHeight: '88px',
      backgroundColor: '#191611',
      color: '#b6a27d',
    },
  },
};

type AdminDataTableProps<T extends object> = {
  columns: TableColumn<T>[];
  data: T[];
  keyField: keyof T & string;
  loading?: boolean;
  emptyMessage: string;
  pagination?: boolean;
  paginationPerPage?: number;
};

export default function AdminDataTable<T extends object>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage,
  pagination = true,
  paginationPerPage = DEFAULT_PAGE_SIZE,
}: AdminDataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = Math.max(1, paginationPerPage);
  const pageCount = Math.max(1, Math.ceil(data.length / pageSize));
  const displayedPage = Math.min(currentPage, pageCount);
  const pageStart = (displayedPage - 1) * pageSize;
  const pageData = pagination ? data.slice(pageStart, pageStart + pageSize) : data;

  useEffect(() => {
    if (pagination) setCurrentPage(1);
  }, [data, pagination]);

  return (
    <div className={`admin-datatable${loading ? ' is-loading' : ''}`} aria-busy={loading}>
      <DataTable
        columns={columns}
        data={pageData}
        keyField={keyField}
        responsive
        noDataComponent={loading ? null : <span className="admin-datatable-message">{emptyMessage}</span>}
        customStyles={customStyles}
      />
      {pagination && (
        <div className="admin-table-footer">
          <span>
            Showing <strong>{data.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + pageSize, data.length)}</strong>
            {' '}of <strong>{data.length}</strong>
          </span>
          <nav className="admin-pagination" aria-label="Table pages">
            <button
              type="button"
              onClick={() => setCurrentPage(displayedPage - 1)}
              disabled={displayedPage === 1}
              aria-label="Previous page"
            >
              <span className="admin-pagination-button-label">Previous</span>
              <span className="admin-pagination-arrow" aria-hidden="true">
                <Icon name="chevron" size={16} />
              </span>
            </button>
            <span className="admin-pagination-page">
              Page <strong>{displayedPage}</strong> of <strong>{pageCount}</strong>
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(displayedPage + 1)}
              disabled={displayedPage === pageCount}
              aria-label="Next page"
            >
              <span className="admin-pagination-button-label">Next</span>
              <span className="admin-pagination-arrow" aria-hidden="true">
                <Icon name="chevron" size={16} />
              </span>
            </button>
          </nav>
        </div>
      )}
      {loading && (
        <div className="admin-datatable-loading" role="status" aria-label="Loading table data">
          <span className="admin-datatable-spinner" aria-hidden="true" />
          <span className="admin-datatable-message">Loading…</span>
        </div>
      )}
    </div>
  );
}
