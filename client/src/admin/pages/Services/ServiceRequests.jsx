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
          <p className="truncate font-medium text-[#071525]">
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
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
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
            <Table
              columns={columns}
              data={requests}
            />
          )}
      </PageContainer>


    </>
  );
}

export default ServiceRequests;