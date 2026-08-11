import { useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import useAuth from '../../../shared/hooks/useAuth';
import authService from '../../../shared/services/authService';
import { isStrongPassword, passwordsMatch } from '../../../shared/validators/authValidators';
import { isRequired } from '../../../shared/validators/formValidators';

/**
 * Admin-only (see constants/routes.js ADMIN_ROUTE_ROLES). Password
 * change requires the current password, is rate-limited server-side,
 * and never trusts this form's client-side checks as the real policy.
 */
function Settings() {
  const { user } = useAuth();
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!isRequired(values.currentPassword)) next.currentPassword = 'Current password is required.';
    if (!isStrongPassword(values.newPassword)) {
      next.newPassword = 'Use at least 8 characters, including a letter and a number.';
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
      await authService.changePassword(values.currentPassword, values.newPassword);
      setSuccess(true);
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setServerError(err.message || 'Unable to update your password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer title="Settings">
      <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
        <p className="mt-2 text-sm text-gray-600">{user?.name || user?.email}</p>
      </div>

      <div className="mt-6 max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-900">Change password</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>
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
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          {success && <p className="text-sm text-green-700">Password updated.</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
}

export default Settings;
