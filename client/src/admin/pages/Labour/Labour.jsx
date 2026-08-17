import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHardHat, FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import useLabour from '../../features/labour/useLabour';
import { ADMIN_PATHS } from '../../../shared/constants/routes';
import { LABOUR_ROLE_LABELS, LABOUR_STATUS_LABELS } from '../../../shared/constants/app';

function Labour() {
  const { workers, loading, error, fetchList, remove } = useLabour();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    setBusyId(row.id);
    try {
      await remove(row.id);
    } catch (err) {
      alert(err.message || 'Unable to delete this worker.');
    } finally {
      setBusyId(null);
    }
  };

  const columns = useMemo(
    () => [
      { key: 'name', label: 'Worker' },
      { key: 'role', label: 'Role', render: (row) => LABOUR_ROLE_LABELS[row.role] || row.role },
      { key: 'status', label: 'Status', render: (row) => LABOUR_STATUS_LABELS[row.status] || row.status },
      {
        key: 'actions',
        label: '',
        render: (row) => (
          <div className="flex items-center gap-1">
            <Link
              to={ADMIN_PATHS.LABOUR_EDIT.replace(':id', row.id)}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-[#071525] hover:bg-[#f5b400]/10 hover:text-[#f5b400]"
            >
              <FaEdit /> Edit
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(row)}
              disabled={busyId === row.id}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <FaTrash /> {busyId === row.id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        ),
      },
    ],

    [busyId]
  );

  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">Workforce</p>
          <h2 className="mt-1 text-2xl font-bold text-[#071525]">Labour Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage workers, roles and workforce status.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-fit items-center gap-3 rounded-md border border-gray-200 bg-white px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
              <FaUsers />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Workers</p>
              <p className="text-sm font-bold text-[#071525]">{workers?.length || 0}</p>
            </div>
          </div>

          <Link
            to={ADMIN_PATHS.LABOUR_CREATE}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#f5b400] px-4 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#e5a900]"
          >
            <FaPlus /> Add worker
          </Link>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#071525] text-[#f5b400]">
          <FaHardHat />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#071525]">Workforce records</h3>
          <p className="text-xs text-gray-500">Current labour records and assignments</p>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-8">
          <Loading label="Loading labour records..." />
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && workers.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-10">
          <EmptyState title="No labour records found" />
        </div>
      )}
      {!loading && !error && workers.length > 0 && <Table columns={columns} data={workers} />}
    </PageContainer>
  );
}

export default Labour;