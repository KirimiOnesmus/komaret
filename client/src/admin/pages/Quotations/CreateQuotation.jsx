import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import QuotationForm from '../../features/quotations/QuotationForm';
import useQuotation from '../../../shared/hooks/useQuotation';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function CreateQuotation() {
  const navigate = useNavigate();
  const { create } = useQuotation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      const created = await create(payload);
      navigate(`/admin/quotations/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create the quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="New quotation"
      breadcrumbs={<Breadcrumbs items={[{ label: 'Quotations', to: ADMIN_PATHS.QUOTATIONS }, { label: 'New quotation' }]} />}
    >
      <QuotationForm mode="create" onSubmit={handleSubmit} submitting={submitting} submitError={error} />
    </PageContainer>
  );
}

export default CreateQuotation;