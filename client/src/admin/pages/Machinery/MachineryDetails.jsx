import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import useMachinery from '../../features/machinery/useMachinery';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function MachineryDetails() {
  const { id } = useParams();
  const { machine, loading, error, fetchOne } = useMachinery();

  useEffect(() => {
    // Server must confirm this user is authorized to view this specific
    // machine record (object-level authorization), not just that
    // they're an authenticated admin.
    fetchOne(id);
  }, [id, fetchOne]);

  if (loading || !machine) return <Loading label="Loading machine..." />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Machinery', to: ADMIN_PATHS.MACHINERY }, { label: machine.name }]} />
      <h1 className="text-xl font-semibold text-gray-900">{machine.name}</h1>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Type</dt>
          <dd className="text-gray-900">{machine.type}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Status</dt>
          <dd className="text-gray-900">{machine.status}</dd>
        </div>
      </dl>
    </PageContainer>
  );
}

export default MachineryDetails;
