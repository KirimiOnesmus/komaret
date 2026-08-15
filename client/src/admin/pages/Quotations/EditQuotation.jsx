import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import QuotationForm from '../../features/quotations/QuotationForm';
import useQuotation from '../../../shared/hooks/useQuotation';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function EditQuotation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotation, loading, error, update } = useQuotation({ id });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await update(id, payload);
      navigate(`/admin/quotations/${id}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quotation) return <Loading label="Loading quotation…" />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer
      title={`Edit ${quotation.number}`}
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: 'Quotations', to: ADMIN_PATHS.QUOTATIONS },
            { label: quotation.number, to: `/admin/quotations/${id}` },
            { label: 'Edit' },
          ]}
        />
      }
    >
      <QuotationForm
        mode="edit"
        initialValues={{
          serviceName: quotation.service?.name,
          clientName: quotation.client?.name,
          items: (quotation.items || []).map((it) => ({
            description: it.description,
            unit: it.unit || '',
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
          discountType: quotation.discountType || 'NONE',
          discountValue: quotation.discountValue ?? '',
          taxRatePct: quotation.taxRatePct ?? 16,
          validUntil: quotation.validUntil ? String(quotation.validUntil).slice(0, 10) : '',
          notes: quotation.notes || '',
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
      />
    </PageContainer>
  );
}

export default EditQuotation;