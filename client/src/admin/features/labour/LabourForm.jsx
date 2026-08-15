import { useState } from 'react';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import {
  LABOUR_ROLES,
  LABOUR_ROLE_LABELS,
  LABOUR_STATUSES,
  LABOUR_STATUS_LABELS,
} from '../../../shared/constants/app';

const ROLE_OPTIONS = LABOUR_ROLES.map((r) => ({ value: r, label: LABOUR_ROLE_LABELS[r] || r }));
const STATUS_OPTIONS = LABOUR_STATUSES.map((s) => ({ value: s, label: LABOUR_STATUS_LABELS[s] || s }));

/**
 * Shared create/edit form for a worker. Fields map to the backend Labour model
 * (name, role, skill, phone, email, internalRate, status, notes, isActive).
 * Phone / email / internal rate are kept internal — never shown publicly.
 */
export default function LabourForm({ mode = 'create', initialValues, submitting, submitError, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    name: '',
    role: 'OTHER',
    skill: '',
    status: 'AVAILABLE',
    phone: '',
    email: '',
    internalRate: '',
    isActive: true,
    notes: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [field]: val }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = 'Worker name is required.';
    if (values.internalRate !== '' && values.internalRate != null && (Number(values.internalRate) < 0 || Number.isNaN(Number(values.internalRate)))) {
      next.internalRate = 'Enter a valid rate.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      name: values.name.trim(),
      role: values.role,
      skill: values.skill.trim() || null,
      status: values.status,
      phone: values.phone.trim() || null,
      email: values.email.trim() || null,
      internalRate: values.internalRate === '' || values.internalRate == null ? null : Number(values.internalRate),
      isActive: Boolean(values.isActive),
      notes: values.notes.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
      )}

      <Input id="name" label="Worker name" placeholder="e.g. Peter Otieno" maxLength={200} value={values.name} onChange={set('name')} error={errors.name} required />

      <div className="grid gap-4 sm:grid-cols-2">
        <Select id="role" label="Role" options={ROLE_OPTIONS} value={values.role} onChange={set('role')} />
        <Select id="status" label="Status" options={STATUS_OPTIONS} value={values.status} onChange={set('status')} />
      </div>

      <Input id="skill" label="Skill / specialisation (optional)" placeholder="e.g. tiling, finishing" maxLength={200} value={values.skill} onChange={set('skill')} />

      {/* Internal contact details — not shown on the public site */}
      <div className="rounded-md border border-gray-200 p-4">
        <p className="mb-1 text-sm font-medium text-gray-700">Internal details</p>
        <p className="mb-3 text-xs text-gray-400">Kept private — never shown on the public site.</p>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="phone" label="WhatsApp phone" value={values.phone} onChange={set('phone')} />
            <Input id="email" label="Email" type="email" value={values.email} onChange={set('email')} />
          </div>
          <Input id="internalRate" label="Internal rate (KES, optional)" type="number" min="0" step="0.01" value={values.internalRate} onChange={set('internalRate')} error={errors.internalRate} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={values.isActive} onChange={set('isActive')} className="h-4 w-4 rounded border-gray-300 text-[#071525] focus:ring-[#071525]" />
        Active worker
      </label>

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea id="notes" rows={3} maxLength={2000} value={values.notes} onChange={set('notes')} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring focus:ring-blue-500" />
      </div>

      <div className="flex items-center gap-3 border-t border-gray-200 pt-5">
        <Button type="submit" disabled={submitting}>{submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Add worker'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>Cancel</Button>
      </div>
    </form>
  );
}