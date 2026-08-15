import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import MachineryForm from '../../features/machinery/MachineryForm';
import useMachinery from '../../features/machinery/useMachinery';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function EditMachinery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { machine, loading, error, fetchOne, update } = useMachinery();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await update(id, payload);
      navigate(ADMIN_PATHS.MACHINERY_DETAILS.replace(':id', id), { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !machine) return <Loading label="Loading machine…" />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer
      title="Edit machinery"
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: 'Machinery', to: ADMIN_PATHS.MACHINERY },
            { label: machine.name, to: ADMIN_PATHS.MACHINERY_DETAILS.replace(':id', id) },
            { label: 'Edit' },
          ]}
        />
      }
    >
      <div className="max-w-2xl">
        <MachineryForm
          mode="edit"
          initialValues={{
            name: machine.name || '',
            type: machine.type || '',
            status: machine.status || 'AVAILABLE',
            hireRate: machine.hireRate ?? '',
            hireTerms: machine.hireTerms || '',
            isPublic: machine.isPublic ?? true,
            description: machine.description || '',
          }}
          submitting={submitting}
          submitError={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ADMIN_PATHS.MACHINERY_DETAILS.replace(':id', id))}
        />
      </div>
    </PageContainer>
  );
}

export default EditMachinery;