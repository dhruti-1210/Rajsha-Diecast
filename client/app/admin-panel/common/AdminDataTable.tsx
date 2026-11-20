'use client';

import DataTable, {
  type PaginationOptions,
  type TableColumn,
  type TableStyles,
} from 'react-data-table-component';

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
  pagination: {
    style: {
      minHeight: '48px',
      padding: '0 12px',
      borderTop: '1px solid #403522',
      backgroundColor: '#191611',
      color: '#b6a27d',
      fontSize: '11px',
    },
    pageButtonsStyle: {
      width: '30px',
      height: '30px',
      padding: '0',
      margin: '0 2px',
      borderRadius: '6px',
      backgroundColor: 'transparent',
      fill: '#d3a84f',
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

const paginationOptions: PaginationOptions = {
  rowsPerPageText: 'Rows per page:',
  rangeSeparatorText: 'of',
  noRowsPerPage: true,
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
  pagination = false,
  paginationPerPage = 10,
}: AdminDataTableProps<T>) {
  return (
    <div className={`admin-datatable${loading ? ' is-loading' : ''}`} aria-busy={loading}>
      <DataTable
        columns={columns}
        data={data}
        keyField={keyField}
        responsive
        noDataComponent={loading ? null : <span className="admin-datatable-message">{emptyMessage}</span>}
        pagination={pagination}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={[paginationPerPage]}
        paginationComponentOptions={paginationOptions}
        customStyles={customStyles}
      />
      {loading && (
        <div className="admin-datatable-loading" role="status" aria-label="Loading table data">
          <span className="admin-datatable-spinner" aria-hidden="true" />
          <span className="admin-datatable-message">Loading…</span>
        </div>
      )}
    </div>
  );
}
