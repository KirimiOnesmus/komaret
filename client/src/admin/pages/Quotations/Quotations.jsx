import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import Button from '../../../shared/components/common/Button';
import useQuotationsList from '../../features/quotations/useQuotationsList';
import { ADMIN_PATHS } from '../../../shared/constants/routes';
import { formatCurrency } from '../../../shared/utils/formatters';
import { QUOTATION_STATUS_LABELS } from '../../../shared/constants/app';

const COLUMNS = [
  {
    key: 'number',
    label: 'Number',
    render: (row) => <span className="font-mono text-sm text-[#071525]">{row.number}</span>,
  },
  { key: 'client', label: 'Client', render: (row) => row.client?.name || '—' },
  { key: 'service', label: 'Service', render: (row) => row.service?.name || '—' },
  { key: 'status', label: 'Status', render: (row) => QUOTATION_STATUS_LABELS[row.status] || row.status },
  { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Link to={`/admin/quotations/${row.id}`} className="text-sm font-medium text-[#071525] hover:underline">
        View
      </Link>
    ),
  },
];

function Quotations() {
  const { list: quotations, loading, error, fetchList } = useQuotationsList();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <PageContainer
      title="Quotations"
      actions={
        <Link to={ADMIN_PATHS.QUOTATION_CREATE}>
          <Button>New quotation</Button>
        </Link>
      }
    >
      {loading && <Loading label="Loading quotations..." />}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && quotations.length === 0 && <EmptyState title="No quotations found" />}
      {!loading && !error && quotations.length > 0 && <Table columns={COLUMNS} data={quotations} />}
    </PageContainer>
  );
}

export default Quotations;