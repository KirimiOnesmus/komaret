import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import ServiceForm from '../../features/services/ServiceForm';
import useAdminServices from '../../features/services/useAdminServices';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function CreateService() {
  const navigate = useNavigate();
  const { create } = useAdminServices();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await create(payload);
      navigate(`/admin/services/${created.id}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to create the service.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="New service"
      breadcrumbs={
        <Breadcrumbs
          items={[{ label: 'Services', to: ADMIN_PATHS.SERVICES }, { label: 'New service' }]}
        />
      }
    >
      <ServiceForm
        mode="create"
        submitting={submitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ADMIN_PATHS.SERVICES)}
      />
    </PageContainer>
  );
}

export default CreateService;