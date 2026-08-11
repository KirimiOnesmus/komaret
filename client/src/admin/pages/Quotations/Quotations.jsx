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

const COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'client', label: 'Client' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Link to={`/admin/quotations/${row.id}`} className="text-blue-600 hover:underline">
        View
      </Link>
    ),
  },
];

function Quotations() {
  const { quotations, loading, error, fetchList } = useQuotationsList();

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
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && quotations.length === 0 && <EmptyState title="No quotations found" />}
      {!loading && !error && quotations.length > 0 && <Table columns={COLUMNS} data={quotations} />}
    </PageContainer>
  );
}

export default Quotations;
