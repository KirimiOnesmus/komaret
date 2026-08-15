import { useEffect } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';

import Select from '../../../shared/components/common/Select';


import useServiceRequests from '../../features/serviceRequests/useServiceRequests';
import { SERVICE_REQUEST_STATUSES } from '../../../shared/constants/app';
import { formatDate } from '../../../shared/utils/formatters';



const STATUS_OPTIONS = SERVICE_REQUEST_STATUSES.map((status) => ({
  value: status,
  label: status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase()),
}));




function ServiceRequests() {
  const {
    requests,
    loading,
    error,
    fetchList,
    updateStatus,
  } = useServiceRequests();

  useEffect(() => {
    fetchList();
  }, [fetchList]);



  const columns = [
    {
      key: 'name',
      label: 'Requester',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900">
            {row.name || '—'}
          </p>

          {row.email && (
            <p className="truncate text-xs text-gray-500">
              {row.email}
            </p>
          )}
        </div>
      ),
    },

    {
      key: 'service',
      label: 'Service',
      render: (row) => (
        <span className="font-medium text-gray-700">
          {row.service?.title ||
            row.service?.name ||
            row.serviceSlug ||
            '—'}
        </span>
      ),
    },

    {
      key: 'createdAt',
      label: 'Submitted',
      render: (row) => (
        <span className="text-gray-500">
          {formatDate(row.createdAt)}
        </span>
      ),
    },

    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Select
          id={`status-${row.id}`}
          options={STATUS_OPTIONS}
          value={row.status}
          onChange={(e) =>
            updateStatus(row.id, e.target.value)
          }
          className="w-40"
        />
      ),
    },
  ];

  return (
    <>
      <PageContainer
        title="Service Requests"
        description="Review incoming service requests and manage the services you offer."
      >
  

   
        {loading && (
          <Loading label="Loading service requests..." />
        )}

  
        {error && (
          <p
            role="alert"
            className="text-sm text-red-600"
          >
            {error}
          </p>
        )}


        {!loading &&
          !error &&
          requests.length === 0 && (
            <EmptyState
              title="No service requests found"
              description="New requests submitted by visitors will appear here."
            />
          )}


        {!loading &&
          !error &&
          requests.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <Table
                columns={columns}
                data={requests}
              />
            </div>
          )}
      </PageContainer>


    </>
  );
}

export default ServiceRequests;