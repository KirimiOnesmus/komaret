import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHardHat,
  FaCogs,
  FaEye,
  FaPlus,
  FaTools,
} from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import useMachinery from '../../features/machinery/useMachinery';
import { ADMIN_PATHS } from '../../../shared/constants/routes';
import { MACHINERY_STATUS_LABELS } from '../../../shared/constants/app';

const COLUMNS = [
  {
    key: 'name',
    label: 'Machine',
  },
  {
    key: 'type',
    label: 'Type',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => MACHINERY_STATUS_LABELS[row.status] || row.status,
  },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Link
        to={ADMIN_PATHS.MACHINERY_DETAILS.replace(':id', row.id)}
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold text-[#071525] transition-colors hover:bg-[#f5b400]/10 hover:text-[#f5b400]"
      >
        <FaEye />
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
    <PageContainer>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
            Equipment
          </p>

          <h2 className="mt-1 text-2xl font-bold text-[#071525]">
            Machinery Management
          </h2>

          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Manage construction equipment, availability and machinery
            assignments.
          </p>
        </div>

    
        <Link
          to={ADMIN_PATHS.MACHINERY_CREATE}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-[#f5b400] px-4 py-2.5 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#e5a900]"
        >
          <FaPlus />
          Add Machinery
        </Link>
      </div>


      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#071525] text-[#f5b400]">
              <FaCogs />
            </div>

            <div>
              <p className="text-xs text-gray-500">Total Machinery</p>
              <p className="text-xl font-bold text-[#071525]">
                {machines?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-green-600">
              <FaTools />
            </div>

            <div>
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-xl font-bold text-[#071525]">
                {machines?.filter(
                  (machine) =>
                    String(machine.status).toLowerCase() === 'available'
                ).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f5b400]/10 text-[#f5b400]">
              <FaHardHat />
            </div>

            <div>
              <p className="text-xs text-gray-500">In Use</p>
              <p className="text-xl font-bold text-[#071525]">
                {machines?.filter(
                  (machine) =>
                    ['in_use', 'hired', 'reserved'].includes(
                      String(machine.status).toLowerCase()
                    )
                ).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#071525] text-[#f5b400]">
          <FaCogs />
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#071525]">
            Machinery records
          </h3>

          <p className="text-xs text-gray-500">
            Current equipment and availability
          </p>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-8">
          <Loading label="Loading machinery..." />
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && machines.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-10">
          <EmptyState title="No machinery found" />
        </div>
      )}

      {!loading && !error && machines.length > 0 && (
        <Table columns={COLUMNS} data={machines} />
      )}
    </PageContainer>
  );
}

export default Machinery;