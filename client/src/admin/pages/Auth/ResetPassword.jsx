import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import authService from '../../../shared/services/authService';
import { isStrongPassword, passwordsMatch } from '../../../shared/validators/authValidators';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Single-use, short-lived token validated and consumed server-side.
  // Never logged or persisted client-side.
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState(false);

  const validate = () => {
    const next = {};
    if (!isStrongPassword(password)) {
      next.password = 'Use at least 8 characters, including a letter and a number.';
    }
    if (!passwordsMatch(password, confirmPassword)) {
      next.confirmPassword = 'Passwords do not match.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!token) {
      setServerError('This reset link is invalid or has expired.');
      return;
    }
    if (!validate()) return;

    setSubmitting(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate(ADMIN_PATHS.LOGIN, { replace: true }), 2000);
    } catch {
      setServerError('This reset link is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-900">Set a new password</h1>
        {done ? (
          <p className="text-center text-sm text-gray-600">
            Your password has been updated. Redirecting to sign in...
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              id="password"
              label="New password"
              type="password"
              autoComplete="new-password"
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />
            <Input
              id="confirmPassword"
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              maxLength={128}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />
            {serverError && (
              <p role="alert" className="text-sm text-red-600">
                {serverError}
              </p>
            )}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        )}
        <div className="mt-4 text-center text-sm">
          <Link to={ADMIN_PATHS.LOGIN} className="text-blue-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
