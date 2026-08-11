import { useCallback, useState } from 'react';
import serviceRequestService from '../services/serviceRequestService';
import { isRequired, isValidPhone } from '../validators/formValidators';
import { isValidEmail } from '../validators/authValidators';

/**
 * Drives the public "request a service / get an estimate" flow used by
 * public/pages/Services/ServiceRequest.jsx and EstimateResult.jsx.
 *
 * Any estimate returned here is advisory only — never treat it as a
 * binding price; final quotations are produced by staff through the
 * admin Quotations module, which is the pricing source of truth.
 */
export default function useServiceRequest() {
  const [submitting, setSubmitting] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { reference, ... }
  const [estimate, setEstimate] = useState(null);

  const validate = useCallback((values) => {
    const errors = {};
    if (!isRequired(values.name)) errors.name = 'Name is required.';
    if (!isValidEmail(values.email || '')) errors.email = 'Enter a valid email address.';
    if (values.phone && !isValidPhone(values.phone)) errors.phone = 'Enter a valid phone number.';
    if (!isRequired(values.serviceSlug)) errors.serviceSlug = 'Select a service.';
    return errors;
  }, []);

  const requestEstimate = useCallback(async (payload) => {
    setEstimating(true);
    setError(null);
    try {
      const { data } = await serviceRequestService.getEstimate(payload);
      setEstimate(data);
      return data;
    } catch (err) {
      setError(err.message || 'Unable to calculate an estimate right now.');
      throw err;
    } finally {
      setEstimating(false);
    }
  }, []);

  const submit = useCallback(
    async (payload) => {
      const errors = validate(payload);
      if (Object.keys(errors).length > 0) {
        return { errors };
      }
      setSubmitting(true);
      setError(null);
      try {
        const { data } = await serviceRequestService.submit(payload);
        setResult(data);
        return { data };
      } catch (err) {
        setError(err.message || 'Something went wrong submitting your request.');
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [validate]
  );

  return { submit, requestEstimate, validate, submitting, estimating, error, result, estimate };
}
