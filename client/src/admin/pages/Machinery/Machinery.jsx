import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import useMachinery from '../../features/machinery/useMachinery';

const COLUMNS = [
  { key: 'name', label: 'Machine' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Link to={`/admin/machinery/${row.id}`} className="text-blue-600 hover:underline">
        View
      </Link>
    ),
  },
];

function Machinery() {
  const { machines, loading, error, fetchList } = useMachinery();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <PageContainer title="Machinery">
      {loading && <Loading label="Loading machinery..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && machines.length === 0 && <EmptyState title="No machinery found" />}
      {!loading && !error && machines.length > 0 && <Table columns={COLUMNS} data={machines} />}
    </PageContainer>
  );
}

export default Machinery;
