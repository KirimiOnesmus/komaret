import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import LabourForm from '../../features/labour/LabourForm';
import useLabour from '../../features/labour/useLabour';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function EditLabour() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { worker, loading, error, fetchOne, update } = useLabour();
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
      navigate(ADMIN_PATHS.LABOUR, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !worker) return <Loading label="Loading worker…" />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer
      title="Edit worker"
      breadcrumbs={<Breadcrumbs items={[{ label: 'Labour', to: ADMIN_PATHS.LABOUR }, { label: worker.name }, { label: 'Edit' }]} />}
    >
      <div className="max-w-2xl">
        <LabourForm
          mode="edit"
          initialValues={{
            name: worker.name || '',
            role: worker.role || 'OTHER',
            skill: worker.skill || '',
            status: worker.status || 'AVAILABLE',
            phone: worker.phone || '',
            email: worker.email || '',
            internalRate: worker.internalRate ?? '',
            isActive: worker.isActive ?? true,
            notes: worker.notes || '',
          }}
          submitting={submitting}
          submitError={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ADMIN_PATHS.LABOUR)}
        />
      </div>
    </PageContainer>
  );
}

export default EditLabour;