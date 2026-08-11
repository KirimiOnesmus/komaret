import { useEffect } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import Select from '../../../shared/components/common/Select';
import useServiceRequests from '../../features/serviceRequests/useServiceRequests';
import { SERVICE_REQUEST_STATUSES } from '../../../shared/constants/app';
import { formatDate } from '../../../shared/utils/formatters';

const STATUS_OPTIONS = SERVICE_REQUEST_STATUSES.map((s) => ({ value: s, label: s }));

function ServiceRequests() {
  const { requests, loading, error, fetchList, updateStatus } = useServiceRequests();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const columns = [
    { key: 'name', label: 'Requester' },
    { key: 'serviceSlug', label: 'Service' },
    { key: 'createdAt', label: 'Submitted', render: (row) => formatDate(row.createdAt) },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Select
          id={`status-${row.id}`}
          options={STATUS_OPTIONS}
          value={row.status}
          onChange={(e) => updateStatus(row.id, e.target.value)}
          className="w-36"
        />
      ),
    },
  ];

  return (
    <PageContainer title="Service Requests">
      {loading && <Loading label="Loading service requests..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && requests.length === 0 && <EmptyState title="No service requests found" />}
      {!loading && !error && requests.length > 0 && <Table columns={columns} data={requests} />}
    </PageContainer>
  );
}

export default ServiceRequests;
