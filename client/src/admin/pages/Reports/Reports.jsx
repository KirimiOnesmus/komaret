import { useEffect, useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Loading from '../../../shared/components/common/Loading';
import api from '../../../shared/services/api';

/**
 * Role-restricted (see constants/routes.js ADMIN_ROUTE_ROLES) at the
 * client level for UI purposes; the server independently enforces this
 * restriction on the /admin/reports endpoint as the real boundary.
 */
function Reports() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/admin/reports/summary')
      .then(({ data }) => {
        if (active) setSummary(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load reports.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageContainer title="Reports">
      {loading && <Loading label="Loading reports..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Projects</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{summary?.projects ?? '-'}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Quotations</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{summary?.quotations ?? '-'}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Machinery</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{summary?.machinery ?? '-'}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Labour</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{summary?.labour ?? '-'}</p>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

export default Reports;
