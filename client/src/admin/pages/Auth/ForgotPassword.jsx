import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import authService from '../../../shared/services/authService';
import { isValidEmail } from '../../../shared/validators/authValidators';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await authService.requestPasswordReset(email);
    } catch {
      // Intentionally ignored: the same confirmation is shown whether
      // or not the account exists, so this response can't be used to
      // enumerate registered accounts.
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-xl font-semibold text-gray-900">Reset your password</h1>
        {submitted ? (
          <p className="text-center text-sm text-gray-600">
            If an account exists for that email, we&apos;ve sent a password reset link.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="username"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Sending...' : 'Send reset link'}
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

export default ForgotPassword;
