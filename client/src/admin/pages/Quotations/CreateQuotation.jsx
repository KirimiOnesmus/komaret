import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import QuotationForm from '../../features/quotations/QuotationForm';
import useQuotation from '../../../shared/hooks/useQuotation';

function CreateQuotation() {
  const navigate = useNavigate();
  const { create } = useQuotation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');
    try {
      const created = await create(values);
      navigate(`/admin/quotations/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create the quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer title="New quotation">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <QuotationForm onSubmit={handleSubmit} submitting={submitting} />
    </PageContainer>
  );
}

export default CreateQuotation;
