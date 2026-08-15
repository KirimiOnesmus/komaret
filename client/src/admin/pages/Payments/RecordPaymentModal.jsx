import { useState } from 'react';
import Modal from '../../../shared/components/common/Modal';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';

const METHOD_OPTIONS = [
  { value: '', label: 'Select method…' },
  { value: 'MPESA', label: 'M-Pesa' },
  { value: 'BANK', label: 'Bank transfer' },
  { value: 'CASH', label: 'Cash' },
  { value: 'CHEQUE', label: 'Cheque' },
  { value: 'CARD', label: 'Card' },
  { value: 'OTHER', label: 'Other' },
];

function todayInput() {
  return new Date().toISOString().slice(0, 10);
}


export default function RecordPaymentModal({ isOpen, onClose, onSave, projects = [] }) {
  const [values, setValues] = useState({
    projectId: '',
    amount: '',
    method: '',
    reference: '',
    paidAt: todayInput(),
    note: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const projectOptions = [
    { value: '', label: 'Select a project…' },
    ...projects.map((p) => ({ value: p.id, label: `${p.code ? p.code + ' — ' : ''}${p.name}` })),
  ];

  const handleSave = async () => {
    setError(null);
    if (!values.projectId) {
      setError('Choose the project this payment is for.');
      return;
    }
    const amount = Number(values.amount);
    if (!amount || amount <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        projectId: values.projectId,
        amount,
        method: values.method || null,
        reference: values.reference.trim() || null,
        paidAt: values.paidAt || null,
        note: values.note.trim() || null,
      });
      setValues({ projectId: '', amount: '', method: '', reference: '', paidAt: todayInput(), note: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to record the payment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record a payment">
      <div className="space-y-4">
        <Select id="projectId" label="Project" options={projectOptions} value={values.projectId} onChange={set('projectId')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="amount" label="Amount (KES)" type="number" min="0" step="0.01" value={values.amount} onChange={set('amount')} required />
          <Select id="method" label="Method" options={METHOD_OPTIONS} value={values.method} onChange={set('method')} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="reference" label="Reference (optional)" maxLength={100} value={values.reference} onChange={set('reference')} />
          <Input id="paidAt" label="Date received" type="date" value={values.paidAt} onChange={set('paidAt')} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="note" className="text-sm font-medium text-gray-700">Note (optional)</label>
          <textarea id="note" rows={2} maxLength={500} value={values.note} onChange={set('note')} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#071525] focus:outline-none focus:ring-1 focus:ring-[#071525]" />
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Record payment'}</Button>
        </div>
      </div>
    </Modal>
  );
}
