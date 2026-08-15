import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import BOQTable from './BOQTable';
import { computeQuotationTotals } from './quotationTotals';
import useAdminServices from '../services/useAdminServices';
import crmService from '../../../shared/services/crmService';
import extractList from '../../../shared/utils/api';
import { formatCurrency } from '../../../shared/utils/formatters';
import {
  DISCOUNT_TYPES,
  DISCOUNT_TYPE_LABELS,
  DEFAULT_TAX_RATE_PCT,
} from '../../../shared/constants/app';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const DISCOUNT_OPTIONS = DISCOUNT_TYPES.map((d) => ({ value: d, label: DISCOUNT_TYPE_LABELS[d] || d }));

function QuotationForm({ mode = 'create', initialValues, onSubmit, submitting = false, submitError }) {
  const { services, fetchList: fetchServices } = useAdminServices();
  const [clients, setClients] = useState([]);
  const [clientsLoaded, setClientsLoaded] = useState(false);

  const [values, setValues] = useState({
    serviceId: '',
    clientId: '',
    items: [],
    discountType: 'NONE',
    discountValue: '',
    taxRatePct: DEFAULT_TAX_RATE_PCT,
    validUntil: '',
    notes: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'create') {
      fetchServices();
      crmService
        .listClients()
        .then((res) => setClients(extractList(res.data)))
        .catch(() => setClients([]))
        .finally(() => setClientsLoaded(true));
    }
  }, [mode, fetchServices]);

  const serviceOptions = useMemo(
    () => [{ value: '', label: 'Select a service…' }, ...services.map((s) => ({ value: s.id, label: s.name }))],
    [services]
  );
  const clientOptions = useMemo(
    () => [{ value: '', label: 'Select a client…' }, ...clients.map((c) => ({ value: c.id, label: c.name }))],
    [clients]
  );

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const setItems = (items) => setValues((v) => ({ ...v, items }));

  const totals = computeQuotationTotals(values.items, {
    discountType: values.discountType,
    discountValue: values.discountValue,
    taxRatePct: values.taxRatePct,
  });

  const validate = () => {
    const next = {};
    if (mode === 'create') {
      if (!values.serviceId) next.serviceId = 'Choose a service.';
      if (!values.clientId) next.clientId = 'Choose a client.';
    }
    if (values.discountType !== 'NONE' && (values.discountValue === '' || Number(values.discountValue) < 0)) {
      next.discountValue = 'Enter a discount value.';
    }
    if (values.taxRatePct === '' || Number(values.taxRatePct) < 0) next.taxRatePct = 'Enter a tax rate.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const items = values.items.map((it, i) => ({
      description: String(it.description || '').trim(),
      unit: (it.unit || '').trim() || null,
      quantity: Number(it.quantity) || 0,
      unitPrice: Number(it.unitPrice) || 0,
      sortOrder: i,
    }));

    const base = {
      items,
      discountType: values.discountType,
      discountValue: values.discountType === 'NONE' ? 0 : Number(values.discountValue) || 0,
      taxRatePct: Number(values.taxRatePct) || 0,
      validUntil: values.validUntil || null,
      notes: values.notes.trim() || null,
    };

    onSubmit?.(mode === 'create' ? { serviceId: values.serviceId, clientId: values.clientId, ...base } : base);
  };

  const noClients = mode === 'create' && clientsLoaded && clients.length === 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-[#071525]">Quotation details</h2>
        <p className="mt-1 text-sm text-gray-500">
          {mode === 'edit' ? 'Service and client are fixed once the quotation exists.' : 'Choose the service and client this quotation is for.'}
        </p>

        {mode === 'create' ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Select id="serviceId" label="Service" options={serviceOptions} value={values.serviceId} onChange={set('serviceId')} error={errors.serviceId} required />
            <Select id="clientId" label="Client" options={clientOptions} value={values.clientId} onChange={set('clientId')} error={errors.clientId} required />
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Service</p>
              <p className="mt-1 text-sm font-medium text-[#071525]">{initialValues?.serviceName || '—'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Client</p>
              <p className="mt-1 text-sm font-medium text-[#071525]">{initialValues?.clientName || '—'}</p>
            </div>
          </div>
        )}

        {noClients && (
          <p className="mt-3 text-sm text-amber-700">
            No clients yet. <Link to={ADMIN_PATHS.CRM} className="font-medium underline">Add a client</Link> before creating a quotation.
          </p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-[#071525]">Bill of quantities</h2>
          <p className="mt-1 text-sm text-gray-500">Add the items and costs that make up this quotation.</p>
        </div>
        <BOQTable items={values.items} onChange={setItems} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-[#071525]">Pricing</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Select id="discountType" label="Discount" options={DISCOUNT_OPTIONS} value={values.discountType} onChange={set('discountType')} />
          {values.discountType !== 'NONE' && (
            <Input
              id="discountValue"
              label={values.discountType === 'PERCENT' ? 'Discount (%)' : 'Discount (KES)'}
              type="number"
              min="0"
              step="0.01"
              value={values.discountValue}
              onChange={set('discountValue')}
              error={errors.discountValue}
            />
          )}
          <Input id="taxRatePct" label="VAT rate (%)" type="number" min="0" step="0.01" value={values.taxRatePct} onChange={set('taxRatePct')} error={errors.taxRatePct} />
        </div>

        {/* live totals preview */}
        <dl className="mt-6 ml-auto max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="text-gray-900">{formatCurrency(totals.subtotal)}</dd></div>
          {totals.discount > 0 && (
            <div className="flex justify-between"><dt className="text-gray-500">Discount</dt><dd className="text-red-600">- {formatCurrency(totals.discount)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-gray-500">VAT ({Number(values.taxRatePct) || 0}%)</dt><dd className="text-gray-900">{formatCurrency(totals.taxAmount)}</dd></div>
          <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold"><dt className="text-[#071525]">Total</dt><dd className="text-[#071525]">{formatCurrency(totals.total)}</dd></div>
        </dl>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input id="validUntil" label="Valid until (optional)" type="date" value={values.validUntil} onChange={set('validUntil')} />
        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes (optional)</label>
          <textarea id="notes" rows={2} maxLength={2000} value={values.notes} onChange={set('notes')} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring focus:ring-blue-500" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting || noClients}>
          {submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create quotation'}
        </Button>
      </div>
    </form>
  );
}

export default QuotationForm;