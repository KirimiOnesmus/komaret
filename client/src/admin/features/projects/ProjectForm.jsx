import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import useAdminServices from '../services/useAdminServices';
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from '../../../shared/constants/app';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const STATUS_OPTIONS = PROJECT_STATUSES.map((s) => ({ value: s, label: PROJECT_STATUS_LABELS[s] || s }));


function ProjectForm({ onSubmit, submitting = false }) {
  const { services, fetchList } = useAdminServices();
  const [values, setValues] = useState({
    name: '',
    serviceId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'PENDING',
    budget: '',
    location: '',
    startDate: '',
    expectedEndDate: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const serviceOptions = useMemo(
    () => services.map((s) => ({ value: s.id, label: s.name })),
    [services]
  );

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Project name is required.';
    if (!values.serviceId) next.serviceId = 'Choose a service.';
    if (!values.clientName.trim()) next.clientName = 'Client name is required.';
    if (!values.clientEmail.trim() && !values.clientPhone.trim()) {
      next.clientEmail = 'Enter a client email or phone (at least one).';
    }
    if (values.budget !== '' && (Number(values.budget) < 0 || Number.isNaN(Number(values.budget)))) {
      next.budget = 'Enter a valid budget.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      name: values.name.trim(),
      serviceId: values.serviceId,
      client: {
        name: values.clientName.trim(),
        email: values.clientEmail.trim() || undefined,
        phone: values.clientPhone.trim() || undefined,
      },
      status: values.status,
      budget: values.budget === '' ? null : Number(values.budget),
      location: values.location.trim() || null,
      description: values.description.trim() || null,
      startDate: values.startDate || null,
      expectedEndDate: values.expectedEndDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input id="name" label="Project name" maxLength={200} value={values.name} onChange={set('name')} error={errors.name} required />

      {serviceOptions.length === 0 ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          No services yet. <Link to={ADMIN_PATHS.SERVICE_CREATE} className="font-medium underline">Create a service</Link> first.
        </p>
      ) : (
        <Select
          id="serviceId"
          label="Service"
          options={[{ value: '', label: 'Select a service…' }, ...serviceOptions]}
          value={values.serviceId}
          onChange={set('serviceId')}
          error={errors.serviceId}
          required
        />
      )}

      <div className="rounded-md border border-gray-200 p-4">
        <p className="mb-3 text-sm font-medium text-gray-700">Client</p>
        <div className="flex flex-col gap-4">
          <Input id="clientName" label="Name" maxLength={200} value={values.clientName} onChange={set('clientName')} error={errors.clientName} required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="clientEmail" label="Email" type="email" value={values.clientEmail} onChange={set('clientEmail')} error={errors.clientEmail} />
            <Input id="clientPhone" label="WhatsApp phone" value={values.clientPhone} onChange={set('clientPhone')} />
          </div>
          <p className="text-xs text-gray-400">Provide at least one of email or phone.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select id="status" label="Status" options={STATUS_OPTIONS} value={values.status} onChange={set('status')} />
        <Input id="budget" label="Budget (KES, optional)" type="number" min="0" step="0.01" value={values.budget} onChange={set('budget')} error={errors.budget} />
      </div>

      <Input id="location" label="Location (optional)" maxLength={200} value={values.location} onChange={set('location')} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="startDate" label="Start date (optional)" type="date" value={values.startDate} onChange={set('startDate')} />
        <Input id="expectedEndDate" label="Expected end (optional)" type="date" value={values.expectedEndDate} onChange={set('expectedEndDate')} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea
          id="description"
          rows={4}
          maxLength={2000}
          value={values.description}
          onChange={set('description')}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Create project'}
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;