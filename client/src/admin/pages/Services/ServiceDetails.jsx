import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaClipboardList, FaTruck, FaUsersCog, FaCalculator } from 'react-icons/fa';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import Button from '../../../shared/components/common/Button';
import useAdminServices from '../../features/services/useAdminServices';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const KES = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 });

function AcceptsBadge({ icon: Icon, label, on }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        on ? 'bg-[#f5b400]/15 text-[#071525]' : 'bg-gray-100 text-gray-400 line-through'
      }`}
    >
      <Icon className="text-[11px]" />
      {label}
    </span>
  );
}

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { service, loading, error, fetchOne, remove } = useAdminServices();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${service.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await remove(id);
      navigate(ADMIN_PATHS.SERVICES, { replace: true });
    } catch (err) {
      alert(err.message || 'Unable to delete this service.');
      setDeleting(false);
    }
  };

  if (loading || !service) return <Loading label="Loading service…" />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  const rates = service.rates || [];

  return (
    <PageContainer
      breadcrumbs={
        <Breadcrumbs items={[{ label: 'Services', to: ADMIN_PATHS.SERVICES }, { label: service.name }]} />
      }
      actions={
        <div className="flex items-center gap-2">
          <Link to={`/admin/services/${id}/edit`}>
            <Button variant="secondary">
              <FaEdit className="mr-2 text-xs" /> Edit
            </Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            <FaTrash className="mr-2 text-xs" /> {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      }
    >
      {/* header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#071525]">{service.name}</h1>
          <p className="mt-1 font-mono text-sm text-gray-500">/services/{service.slug}</p>
        </div>
        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
            service.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${service.isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
          {service.isPublished ? 'Published' : 'Hidden'}
        </span>
      </div>

      {/* meta */}
      <dl className="mt-6 grid gap-6 rounded-xl border border-gray-200 p-5 sm:grid-cols-3">
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400">Category</dt>
          <dd className="mt-1 text-sm font-medium text-[#071525]">{service.category || 'Uncategorised'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400">Display order</dt>
          <dd className="mt-1 text-sm font-medium text-[#071525]">{service.sortOrder ?? 0}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-gray-400">Rate-card items</dt>
          <dd className="mt-1 text-sm font-medium text-[#071525]">{rates.length}</dd>
        </div>
      </dl>

      {service.summary && (
        <p className="mt-6 max-w-3xl text-sm leading-6 text-gray-700">{service.summary}</p>
      )}
      {service.description && (
        <div className="mt-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Description</h2>
          <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-6 text-gray-700">
            {service.description}
          </p>
        </div>
      )}

      {/* accepts */}
      <div className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">Clients can request</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <AcceptsBadge icon={FaClipboardList} label="Service request" on={service.supportsServiceRequest} />
          <AcceptsBadge icon={FaTruck} label="Machinery" on={service.supportsMachineryRequest} />
          <AcceptsBadge icon={FaUsersCog} label="Labour" on={service.supportsLabourRequest} />
          <AcceptsBadge
            icon={FaCalculator}
            label={service.supportsEstimate ? `Estimate (±${Number(service.estimateMarginPct)}%)` : 'Estimate'}
            on={service.supportsEstimate}
          />
        </div>
      </div>

      {/* rate card */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-[#071525]">Rate card</h2>
        <p className="mt-0.5 text-xs text-gray-400">
          Drives the instant estimate. Managed via the rate-card endpoints.
        </p>
        {rates.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
            No rate-card items yet.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Item</th>
                  <th className="px-4 py-2 font-medium">Unit</th>
                  <th className="px-4 py-2 font-medium">Unit price</th>
                  <th className="px-4 py-2 font-medium">Default qty</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {rates.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 font-medium text-[#071525]">{r.label}</td>
                    <td className="px-4 py-2 text-gray-600">{r.unit}</td>
                    <td className="px-4 py-2 text-gray-800">{KES.format(Number(r.unitPrice) || 0)}</td>
                    <td className="px-4 py-2 text-gray-600">{r.defaultQty ?? '—'}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          r.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {r.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* related */}
      <div className="mt-10 border-t border-gray-200 pt-6">
        <h2 className="text-sm font-bold text-[#071525]">Related records</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Link
            to={`/admin/projects?service=${encodeURIComponent(service.id)}`}
            className="rounded-lg border border-gray-200 p-5 transition hover:border-[#f5b400]/60 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-[#071525]">Projects</p>
            <p className="mt-1 text-sm text-gray-500">Projects using this service.</p>
          </Link>
          <Link
            to={`/admin/quotations?service=${encodeURIComponent(service.id)}`}
            className="rounded-lg border border-gray-200 p-5 transition hover:border-[#f5b400]/60 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-[#071525]">Quotations</p>
            <p className="mt-1 text-sm text-gray-500">Quotations for this service.</p>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default ServiceDetails;