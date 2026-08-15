import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import LabourForm from '../../features/labour/LabourForm';
import useLabour from '../../features/labour/useLabour';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function CreateLabour() {
  const navigate = useNavigate();
  const { create } = useLabour();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await create(payload);
      navigate(ADMIN_PATHS.LABOUR, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to add the worker.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Add worker"
      breadcrumbs={<Breadcrumbs items={[{ label: 'Labour', to: ADMIN_PATHS.LABOUR }, { label: 'Add worker' }]} />}
    >
      <div className="max-w-2xl">
        <LabourForm mode="create" submitting={submitting} submitError={submitError} onSubmit={handleSubmit} onCancel={() => navigate(ADMIN_PATHS.LABOUR)} />
      </div>
    </PageContainer>
  );
}

export default CreateLabour;