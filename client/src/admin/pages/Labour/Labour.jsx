import { useEffect } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import useLabour from '../../features/labour/useLabour';

const COLUMNS = [
  { key: 'name', label: 'Worker' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
];

function Labour() {
  const { workers, loading, error, fetchList } = useLabour();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <PageContainer title="Labour">
      {loading && <Loading label="Loading labour records..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && workers.length === 0 && <EmptyState title="No labour records found" />}
      {!loading && !error && workers.length > 0 && <Table columns={COLUMNS} data={workers} />}
    </PageContainer>
  );
}

export default Labour;
