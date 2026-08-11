import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Loading from '../../../shared/components/common/Loading';
import QuotationForm from '../../features/quotations/QuotationForm';
import useQuotation from '../../../shared/hooks/useQuotation';

function EditQuotation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotation, loading, error, update } = useQuotation({ id });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await update(id, values);
      navigate(`/admin/quotations/${id}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quotation) return <Loading label="Loading quotation..." />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer title="Edit quotation">
      {submitError && <p className="mb-4 text-sm text-red-600">{submitError}</p>}
      <QuotationForm initialValues={quotation} onSubmit={handleSubmit} submitting={submitting} />
    </PageContainer>
  );
}

export default EditQuotation;
