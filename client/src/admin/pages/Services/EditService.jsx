import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import ServiceForm from '../../features/services/ServiceForm';
import useAdminServices from '../../features/services/useAdminServices';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { service, loading, error, fetchOne, update } = useAdminServices();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await update(id, payload);
      navigate(`/admin/services/${id}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !service) return <Loading label="Loading service…" />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer
      title="Edit service"
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: 'Services', to: ADMIN_PATHS.SERVICES },
            { label: service.name, to: `/admin/services/${id}` },
            { label: 'Edit' },
          ]}
        />
      }
    >
      <ServiceForm
        mode="edit"
        initialValues={{
          name: service.name || '',
          slug: service.slug || '',
          category: service.category || '',
          summary: service.summary || '',
          description: service.description || '',
          isPublished: service.isPublished ?? true,
          sortOrder: service.sortOrder ?? 0,
          supportsServiceRequest: service.supportsServiceRequest ?? true,
          supportsMachineryRequest: service.supportsMachineryRequest ?? false,
          supportsLabourRequest: service.supportsLabourRequest ?? false,
          supportsEstimate: service.supportsEstimate ?? false,
          estimateMarginPct: service.estimateMarginPct ?? 10,
        }}
        submitting={submitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/admin/services/${id}`)}
      />
    </PageContainer>
  );
}

export default EditService;