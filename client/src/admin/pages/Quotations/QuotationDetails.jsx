import { useParams, Link } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import Button from '../../../shared/components/common/Button';
import Select from '../../../shared/components/common/Select';
import useQuotation from '../../../shared/hooks/useQuotation';
import { formatCurrency } from '../../../shared/utils/formatters';
import { QUOTATION_STATUSES } from '../../../shared/constants/app';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const STATUS_OPTIONS = QUOTATION_STATUSES.map((s) => ({ value: s, label: s }));

function QuotationDetails() {
  const { id } = useParams();
  const { quotation, loading, error, updateStatus } = useQuotation({ id });

  if (loading || !quotation) return <Loading label="Loading quotation..." />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer
      actions={
        <Link to={`/admin/quotations/${id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
      }
    >
      <Breadcrumbs items={[{ label: 'Quotations', to: ADMIN_PATHS.QUOTATIONS }, { label: quotation.title }]} />
      <h1 className="text-xl font-semibold text-gray-900">{quotation.title}</h1>
      <p className="mt-1 text-sm text-gray-500">{quotation.client}</p>

      <div className="mt-6 flex max-w-xs items-center gap-3">
        <Select
          id="status"
          label="Status"
          options={STATUS_OPTIONS}
          value={quotation.status}
          onChange={(e) => updateStatus(id, e.target.value)}
        />
      </div>

      <p className="mt-6 text-lg font-semibold text-gray-900">
        Total: {formatCurrency(quotation.total)}
      </p>
    </PageContainer>
  );
}

export default QuotationDetails;
