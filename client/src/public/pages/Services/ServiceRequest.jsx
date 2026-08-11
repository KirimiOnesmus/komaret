import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import useServiceRequest from '../../../shared/hooks/useServiceRequest';

/**
 * Public, unauthenticated lead-capture form. Server must independently
 * validate/sanitize all fields and rate-limit submissions by IP — this
 * page's client-side checks (see useServiceRequest.validate) are UX only.
 */
function ServiceRequest() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { submit, submitting, error } = useServiceRequest();
  const [values, setValues] = useState({ name: '', email: '', phone: '', details: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...values, serviceSlug: slug };
    const result = await submit(payload).catch(() => null);
    if (result?.errors) {
      setErrors(result.errors);
      return;
    }
    if (result?.data) {
      navigate(`/services/${encodeURIComponent(slug)}/confirmation`, {
        state: { reference: result.data.reference },
      });
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Request this service</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
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
          {submitting ? 'Submitting...' : 'Submit request'}
        </Button>
      </form>
    </div>
  );
}

export default ServiceRequest;
