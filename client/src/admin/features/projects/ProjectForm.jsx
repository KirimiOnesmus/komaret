import { useState } from 'react';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import { isRequired, isPositiveNumber, validateForm } from '../../../shared/validators/formValidators';
import { PROJECT_STATUSES } from '../../../shared/constants/app';

const STATUS_OPTIONS = PROJECT_STATUSES.map((s) => ({
  value: s,
  label: s.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase()),
}));

const RULES = {
  name: { test: isRequired, message: 'Project name is required.' },
  client: { test: isRequired, message: 'Client is required.' },
  budget: { test: (v) => !v || isPositiveNumber(v), message: 'Enter a valid positive budget.' },
};

function ProjectForm({ initialValues, onSubmit, submitting = false }) {
  const [values, setValues] = useState({
    name: '',
    client: '',
    status: PROJECT_STATUSES[0],
    budget: '',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validateForm(values, RULES);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        id="name"
        label="Project name"
        maxLength={200}
        value={values.name}
        onChange={handleChange('name')}
        error={errors.name}
        required
      />
      <Input
        id="client"
        label="Client"
        maxLength={200}
        value={values.client}
        onChange={handleChange('client')}
        error={errors.client}
        required
      />
      <Select
        id="status"
        label="Status"
        options={STATUS_OPTIONS}
        value={values.status}
        onChange={handleChange('status')}
      />
      <Input
        id="budget"
        label="Budget (optional)"
        type="number"
        min="0"
        step="0.01"
        value={values.budget}
        onChange={handleChange('budget')}
        error={errors.budget}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save project'}
      </Button>
    </form>
  );
}

export default ProjectForm;
