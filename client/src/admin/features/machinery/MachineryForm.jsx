import { useState } from 'react';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import { MACHINERY_STATUSES, MACHINERY_STATUS_LABELS } from '../../../shared/constants/app';

const STATUS_OPTIONS = MACHINERY_STATUSES.map((s) => ({ value: s, label: MACHINERY_STATUS_LABELS[s] || s }));


export default function MachineryForm({ mode = 'create', initialValues, submitting, submitError, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    name: '',
    type: '',
    status: 'AVAILABLE',
    hireRate: '',
    hireTerms: '',
    isPublic: true,
    description: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [field]: val }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Machine name is required.';
    if (values.hireRate !== '' && values.hireRate != null && (Number(values.hireRate) < 0 || Number.isNaN(Number(values.hireRate)))) {
      next.hireRate = 'Enter a valid hire rate.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      name: values.name.trim(),
      type: values.type.trim() || null,
      status: values.status,
      hireRate: values.hireRate === '' || values.hireRate == null ? null : Number(values.hireRate),
      hireTerms: values.hireTerms.trim() || null,
      isPublic: Boolean(values.isPublic),
      description: values.description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
      )}

      <Input id="name" label="Machine name" placeholder="e.g. CAT 320 Excavator" maxLength={200} value={values.name} onChange={set('name')} error={errors.name} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="type" label="Type (optional)" placeholder="e.g. Excavator" maxLength={200} value={values.type} onChange={set('type')} />
        <Select id="status" label="Status" options={STATUS_OPTIONS} value={values.status} onChange={set('status')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="hireRate" label="Hire rate (KES, optional)" type="number" min="0" step="0.01" value={values.hireRate} onChange={set('hireRate')} error={errors.hireRate} />
        <Input id="hireTerms" label="Hire terms (optional)" placeholder="e.g. per day" maxLength={200} value={values.hireTerms} onChange={set('hireTerms')} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={values.isPublic} onChange={set('isPublic')} className="h-4 w-4 rounded border-gray-300 text-[#071525] focus:ring-[#071525]" />
        Show in the public machinery catalogue
      </label>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">Description (optional)</label>
        <textarea id="description" rows={4} maxLength={2000} value={values.description} onChange={set('description')} placeholder="Specifications, capacity, notes…" className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring focus:ring-blue-500" />
      </div>

      <div className="flex items-center gap-3 border-t border-gray-200 pt-5">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add machinery'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>Cancel</Button>
      </div>
    </form>
  );
}