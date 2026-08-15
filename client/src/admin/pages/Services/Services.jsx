import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import useAdminServices from '../../features/services/useAdminServices';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const ACCEPTS = [
  ['supportsServiceRequest', 'Service'],
  ['supportsMachineryRequest', 'Machinery'],
  ['supportsLabourRequest', 'Labour'],
  ['supportsEstimate', 'Estimate'],
];

const COLUMNS = [
  {
    key: 'name',
    label: 'Service',
    render: (row) => (
      <div>
        <p className="font-medium text-[#071525]">{row.name}</p>
        <p className="font-mono text-xs text-gray-400">/{row.slug}</p>
      </div>
    ),
  },
  {
    key: 'category',
    label: 'Category',
    render: (row) => row.category || <span className="text-gray-400">—</span>,
  },
  {
    key: 'accepts',
    label: 'Accepts',
    render: (row) => {
      const on = ACCEPTS.filter(([k]) => row[k]).map(([, label]) => label);
      return on.length ? (
        <div className="flex flex-wrap gap-1">
          {on.map((label) => (
            <span key={label} className="rounded-full bg-[#f5b400]/15 px-2 py-0.5 text-xs font-medium text-[#071525]">
              {label}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
  {
    key: 'rates',
    label: 'Rates',
    render: (row) => row._count?.rates ?? 0,
  },
  {
    key: 'isPublished',
    label: 'Status',
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
          row.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {row.isPublished ? 'Published' : 'Hidden'}
      </span>
    ),
  },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Link to={`/admin/services/${row.id}`} className="text-sm font-semibold text-[#071525] hover:text-[#f5b400]">
        View
      </Link>
    ),
  },
];

function Services() {
  const { services, loading, error, fetchList } = useAdminServices();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <PageContainer
      title="Services"
      description="Your service catalogue — the spine of requests, quotations and projects."
      actions={
        <Link
          to={ADMIN_PATHS.SERVICE_CREATE}
          className="inline-flex items-center gap-2 rounded-md bg-[#071525] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d2036]"
        >
          <FaPlus className="text-xs" /> New service
        </Link>
      }
    >
      {loading && <Loading label="Loading services…" />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && services.length === 0 && (
        <EmptyState
          title="No services yet"
          message="Add your first service to start taking requests and quotations."
        />
      )}

      {!loading && !error && services.length > 0 && <Table columns={COLUMNS} data={services} />}
    </PageContainer>
  );
}

export default Services;