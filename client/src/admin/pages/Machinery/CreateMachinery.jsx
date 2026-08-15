import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import MachineryForm from '../../features/machinery/MachineryForm';
import useMachinery from '../../features/machinery/useMachinery';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function CreateMachinery() {
  const navigate = useNavigate();
  const { create } = useMachinery();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const created = await create(payload);
      navigate(ADMIN_PATHS.MACHINERY_DETAILS.replace(':id', created.id), { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to add the machine.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Add machinery"
      breadcrumbs={<Breadcrumbs items={[{ label: 'Machinery', to: ADMIN_PATHS.MACHINERY }, { label: 'Add machinery' }]} />}
    >
      <div className="max-w-2xl">
        <MachineryForm
          mode="create"
          submitting={submitting}
          submitError={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ADMIN_PATHS.MACHINERY)}
        />
      </div>
    </PageContainer>
  );
}

export default CreateMachinery;