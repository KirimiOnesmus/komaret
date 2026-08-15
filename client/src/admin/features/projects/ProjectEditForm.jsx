import { useState } from 'react';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS } from '../../../shared/constants/app';

const STATUS_OPTIONS = PROJECT_STATUSES.map((s) => ({ value: s, label: PROJECT_STATUS_LABELS[s] || s }));

function toDateInput(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
}

function ProjectEditForm({ project, submitting, onSubmit }) {
  const [values, setValues] = useState({
    name: project.name || '',
    status: project.status || 'PENDING',
    progressPct: project.progressPct ?? 0,
    budget: project.budget ?? '',
    location: project.location || '',
    description: project.description || '',
    publicSummary: project.publicSummary || '',
    startDate: toDateInput(project.startDate),
    expectedEndDate: toDateInput(project.expectedEndDate),
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Project name is required.';
    const p = Number(values.progressPct);
    if (Number.isNaN(p) || p < 0 || p > 100) next.progressPct = 'Progress must be 0–100.';
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
      status: values.status,
      progressPct: Number(values.progressPct) || 0,
      budget: values.budget === '' ? null : Number(values.budget),
      location: values.location.trim() || null,
      description: values.description.trim() || null,
      publicSummary: values.publicSummary.trim() || null,
      startDate: values.startDate || null,
      expectedEndDate: values.expectedEndDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Input id="name" label="Project name" maxLength={200} value={values.name} onChange={set('name')} error={errors.name} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select id="status" label="Status" options={STATUS_OPTIONS} value={values.status} onChange={set('status')} />
        <Input id="progressPct" label="Progress (%)" type="number" min="0" max="100" step="1" value={values.progressPct} onChange={set('progressPct')} error={errors.progressPct} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="budget" label="Budget (KES, optional)" type="number" min="0" step="0.01" value={values.budget} onChange={set('budget')} error={errors.budget} />
        <Input id="location" label="Location (optional)" maxLength={200} value={values.location} onChange={set('location')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="startDate" label="Start date" type="date" value={values.startDate} onChange={set('startDate')} />
        <Input id="expectedEndDate" label="Expected end" type="date" value={values.expectedEndDate} onChange={set('expectedEndDate')} />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description (internal, optional)</label>
        <textarea id="description" rows={3} maxLength={2000} value={values.description} onChange={set('description')} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring focus:ring-blue-500" />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="publicSummary" className="text-sm font-medium text-gray-700">Public summary (optional)</label>
        <textarea id="publicSummary" rows={2} maxLength={2000} value={values.publicSummary} onChange={set('publicSummary')} placeholder="Shown publicly for completed showcase projects" className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring focus:ring-blue-500" />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : 'Save changes'}</Button>
      </div>
    </form>
  );
}

export default ProjectEditForm;