import { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import useServiceRequest from '../../../shared/hooks/useServiceRequest';
import { formatCurrency } from '../../../shared/utils/formatters';

/**
 * Public "instant estimate" page for a service.
 *
 * Collects a few high-level project inputs, asks the backend for a rough
 * figure (serviceRequestService.getEstimate), and shows the result.
 *
 * The estimate is ADVISORY ONLY and never a binding price — the real,
 * itemized quotation is produced by staff via the admin Quotations
 * module after review. The server independently validates every field.
 */

const SCOPE_OPTIONS = [
  { value: 'basic', label: 'Basic / standard finish' },
  { value: 'standard', label: 'Mid-range finish' },
  { value: 'premium', label: 'Premium / high-end finish' },
];

function EstimateResult() {
  const { slug } = useParams();
  const location = useLocation();
  const { requestEstimate, estimating, error } = useServiceRequest();

  // An estimate may also arrive via router state (e.g. from another flow);
  // otherwise the visitor generates one with the form below.
  const [estimate, setEstimate] = useState(location.state?.estimate ?? null);
  const [values, setValues] = useState({ size: '', scope: 'standard', notes: '' });

  const handleChange = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await requestEstimate({
      serviceSlug: slug,
      size: values.size ? Number(values.size) : undefined,
      scope: values.scope,
      notes: values.notes,
    }).catch(() => null);
    if (data) setEstimate(data);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Instant estimate</h1>

      {estimate ? (
        <div className="mt-6 text-center">
          <p className="text-4xl font-bold text-blue-600">
            {formatCurrency(estimate.amount)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This is a rough estimate only. A member of our team will follow up
            with a detailed, itemized quotation.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="secondary" onClick={() => setEstimate(null)}>
              Adjust inputs
            </Button>
            <Link to={`/services/${encodeURIComponent(slug)}/request`}>
              <Button>Request full details</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Give us a few details and we&apos;ll show you a ballpark figure right
            away. No obligation.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <Input
              id="size"
              label="Approximate size (m²)"
              type="number"
              min="0"
              value={values.size}
              onChange={handleChange('size')}
            />
            <Select
              id="scope"
              label="Finish level"
              options={SCOPE_OPTIONS}
              value={values.scope}
              onChange={handleChange('scope')}
            />
            <div className="flex flex-col gap-1">
              <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                rows={4}
                maxLength={2000}
                value={values.notes}
                onChange={handleChange('notes')}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <Button type="submit" disabled={estimating}>
              {estimating ? 'Calculating...' : 'Get estimate'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export default EstimateResult;
