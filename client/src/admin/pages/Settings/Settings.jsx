import { useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import useAuth from '../../../shared/hooks/useAuth';
import authService from '../../../shared/services/authService';
import {
  isStrongPassword,
  passwordsMatch,
} from '../../../shared/validators/authValidators';
import { isRequired } from '../../../shared/validators/formValidators';


function Settings() {
  const { user } = useAuth();

  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((v) => ({
      ...v,
      [field]: e.target.value,
    }));

  
    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: '',
      }));
    }

    setSuccess(false);
    setServerError('');
  };

  const validate = () => {
    const next = {};

    if (!isRequired(values.currentPassword)) {
      next.currentPassword = 'Current password is required.';
    }

    if (!isStrongPassword(values.newPassword)) {
      next.newPassword =
        'Use at least 8 characters, including a letter and a number.';
    }

    if (!passwordsMatch(values.newPassword, values.confirmPassword)) {
      next.confirmPassword = 'Passwords do not match.';
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError('');
    setSuccess(false);

    if (!validate()) return;

    setSubmitting(true);

    try {
      await authService.changePassword(
        values.currentPassword,
        values.newPassword
      );

      setSuccess(true);

      setValues({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setErrors({});
    } catch (err) {
      setServerError(
        err.message || 'Unable to update your password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="Settings"
      className="max-w-7xl"
    >
      <div className="grid gap-6 lg:grid-cols-3">

        <section className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Account
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Your account information.
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Name
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {user?.name || '—'}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Email
              </p>
              <p className="mt-1 break-all text-sm text-gray-700">
                {user?.email || '—'}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Role
              </p>
              <p className="mt-1 text-sm font-medium capitalize text-gray-900">
                {user?.role || '—'}
              </p>
            </div>
          </div>
        </section>


        <section className="rounded-lg border border-gray-200 bg-white lg:col-span-2">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Change password
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Update your password to keep your account secure.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  id="currentPassword"
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                  maxLength={128}
                  value={values.currentPassword}
                  onChange={handleChange('currentPassword')}
                  error={errors.currentPassword}
                  required
                />
              </div>

              <Input
                id="newPassword"
                label="New password"
                type="password"
                autoComplete="new-password"
                maxLength={128}
                value={values.newPassword}
                onChange={handleChange('newPassword')}
                error={errors.newPassword}
                required
              />

              <Input
                id="confirmPassword"
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                maxLength={128}
                value={values.confirmPassword}
                onChange={handleChange('confirmPassword')}
                error={errors.confirmPassword}
                required
              />
            </div>

            <div className="mt-4 rounded-md bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-gray-700">
                Password requirements
              </p>

              <ul className="mt-2 space-y-1 text-xs text-gray-500">
                <li>• At least 8 characters</li>
                <li>• Must contain a letter</li>
                <li>• Must contain a number</li>
              </ul>
            </div>

            {serverError && (
              <div
                role="alert"
                className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3"
              >
                <p className="text-sm text-red-600">
                  {serverError}
                </p>
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3"
              >
                <p className="text-sm text-green-700">
                  Password updated successfully.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Updating...'
                  : 'Update password'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </PageContainer>
  );
}

export default Settings;