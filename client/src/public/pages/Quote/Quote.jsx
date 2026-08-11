import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import useServiceRequest from '../../../shared/hooks/useServiceRequest';

const SERVICE_OPTIONS = [
  { value: 'general-construction', label: 'General Construction' },
  { value: 'interior-design', label: 'Interior Design' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'machinery-hire', label: 'Machinery Hire' },
];


function Quote() {
  const navigate = useNavigate();
  const { submit, submitting, error } = useServiceRequest();
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    serviceSlug: SERVICE_OPTIONS[0].value,
    details: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submit(values).catch(() => null);
    if (result?.errors) {
      setErrors(result.errors);
      return;
    }
    if (result?.data) {
      navigate(`/services/${encodeURIComponent(values.serviceSlug)}/confirmation`, {
        state: { reference: result.data.reference },
      });
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Get a quote</h1>
      <p className="mt-2 text-gray-600">Tell us a bit about your project and we&apos;ll be in touch.</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
        <Input
          id="name"
          label="Name"
          maxLength={150}
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          maxLength={254}
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />
        <Input
          id="phone"
          label="Phone (optional)"
          type="tel"
          maxLength={20}
          value={values.phone}
          onChange={handleChange('phone')}
          error={errors.phone}
        />
        <Select
          id="serviceSlug"
          label="Service"
          options={SERVICE_OPTIONS}
          value={values.serviceSlug}
          onChange={handleChange('serviceSlug')}
        />
        <div className="flex flex-col gap-1">
          <label htmlFor="details" className="text-sm font-medium text-gray-700">
            Project details
          </label>
          <textarea
            id="details"
            rows={5}
            maxLength={2000}
            value={values.details}
            onChange={handleChange('details')}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Request quote'}
        </Button>
      </form>
    </div>
  );
}

export default Quote;
