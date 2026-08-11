import { useState } from 'react';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { isValidEmail } from '../../../shared/validators/authValidators';
import { isRequired } from '../../../shared/validators/formValidators';

/**
 * Client-side checks are UX only — the server owns rate limiting,
 * account lockout after repeated failures, and must return a generic
 * "invalid email or password" error rather than confirming whether the
 * email is registered (prevents user enumeration).
 */
function LoginForm({ onSubmit, submitting = false, serverError }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    if (!isRequired(values.password)) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        id="email"
        label="Email"
        type="email"
        autoComplete="username"
        maxLength={254}
        value={values.email}
        onChange={handleChange('email')}
        error={errors.email}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        maxLength={128}
        value={values.password}
        onChange={handleChange('password')}
        error={errors.password}
        required
      />
      {serverError && (
        <p role="alert" className="text-sm text-red-600">
          {serverError}
        </p>
      )}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}

export default LoginForm;
