import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCogs,
  FaHardHat,
  FaTools,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import useMachinery from '../../features/machinery/useMachinery';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function MachineryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { machine, loading, error, fetchOne, remove } = useMachinery();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${machine.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await remove(id);
      navigate(ADMIN_PATHS.MACHINERY, { replace: true });
    } catch (err) {
      alert(err.message || 'Unable to delete this machine.');
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading label="Loading machine..." />;
  }

  if (error) {
    return (
      <PageContainer>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      </PageContainer>
    );
  }

  if (!machine) return null;

  const status = String(machine.status || '').toLowerCase();

  const isAvailable = status === 'available';

  return (
    <PageContainer>

      <Breadcrumbs
        items={[
          {
            label: 'Machinery',
            to: ADMIN_PATHS.MACHINERY,
          },
          {
            label: machine.name,
          },
        ]}
      />


      <Link
        to={ADMIN_PATHS.MACHINERY}
        className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-gray-500 transition-colors hover:text-[#f5b400]"
      >
        <FaArrowLeft />
        Back to machinery
      </Link>


      <div className="mt-6 flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#071525] text-xl text-[#f5b400]">
            <FaCogs />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
              Machinery
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#071525]">
              {machine.name}
            </h1>

            {machine.type && (
              <p className="mt-1 text-sm text-gray-500">
                {machine.type}
              </p>
            )}
          </div>
        </div>


        <div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${
              isAvailable
                ? 'bg-green-50 text-green-700'
                : status === 'maintenance'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-[#f5b400]/10 text-[#8a6500]'
            }`}
          >
            <span
              className={`mr-2 h-1.5 w-1.5 rounded-full ${
                isAvailable
                  ? 'bg-green-500'
                  : status === 'maintenance'
                    ? 'bg-red-500'
                    : 'bg-[#f5b400]'
              }`}
            />

            {machine.status || 'Unknown'}
          </span>
        </div>
      </div>


      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-sm font-bold text-[#071525]">
                Machine Information
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Equipment specifications and current details
              </p>
            </div>

            <dl className="grid gap-px bg-gray-100 sm:grid-cols-2">
              <div className="bg-white p-5">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Machine Name
                </dt>

                <dd className="mt-2 text-sm font-semibold text-[#071525]">
                  {machine.name || '—'}
                </dd>
              </div>

              <div className="bg-white p-5">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Machine Type
                </dt>

                <dd className="mt-2 text-sm font-semibold text-[#071525]">
                  {machine.type || '—'}
                </dd>
              </div>

              <div className="bg-white p-5">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Status
                </dt>

                <dd className="mt-2 text-sm font-semibold text-[#071525]">
                  {machine.status || '—'}
                </dd>
              </div>

              {machine.location && (
                <div className="bg-white p-5">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Location
                  </dt>

                  <dd className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#071525]">
                    <FaMapMarkerAlt className="text-[#f5b400]" />
                    {machine.location}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>


        <div>
          <div className="rounded-lg bg-[#071525] p-6 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f5b400] text-[#071525]">
              <FaTools />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Equipment Status
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-300">
              This machine is currently marked as{' '}
              <span className="font-semibold text-[#f5b400]">
                {machine.status || 'unknown'}
              </span>
              .
            </p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Current condition
              </p>

              <p className="mt-1 text-sm font-semibold">
                {isAvailable
                  ? 'Available for assignment'
                  : 'Currently assigned or unavailable'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={ADMIN_PATHS.MACHINERY_EDIT.replace(':id', id)}
          className="inline-flex items-center gap-2 rounded-md bg-[#071525] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0d2036]"
        >
          <FaEdit />
          Edit machine
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
        >
          <FaTrash />
          {deleting ? 'Deleting…' : 'Delete'}
        </button>

        <Link
          to={ADMIN_PATHS.MACHINERY}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#071525] transition-colors hover:border-[#f5b400] hover:text-[#f5b400]"
        >
          <FaArrowLeft />
          Back to Machinery
        </Link>
      </div>
    </PageContainer>
  );
}

export default MachineryDetails;