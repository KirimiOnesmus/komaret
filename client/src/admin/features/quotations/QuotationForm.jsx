import { useState } from 'react';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import BOQTable from './BOQTable';
import { isRequired, validateForm } from '../../../shared/validators/formValidators';

const RULES = {
  title: { test: isRequired, message: 'Title is required.' },
  client: { test: isRequired, message: 'Client is required.' },
};

function QuotationForm({ initialValues, onSubmit, submitting = false }) {
  const [values, setValues] = useState({
    title: '',
    client: '',
    items: [],
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));
  const handleItemsChange = (items) => setValues((v) => ({ ...v, items }));

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
        id="title"
        label="Title"
        maxLength={200}
        value={values.title}
        onChange={handleChange('title')}
        error={errors.title}
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
      <BOQTable items={values.items} onChange={handleItemsChange} />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save quotation'}
      </Button>
    </form>
  );
}

export default QuotationForm;
