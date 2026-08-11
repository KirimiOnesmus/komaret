import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../../shared/hooks/useAuth';
import LoginForm from './LoginForm';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || ADMIN_PATHS.DASHBOARD;

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // Deliberately generic: never confirm/deny whether the email is
      // registered, and never surface raw server error text here.
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-semibold text-gray-900">Admin sign in</h1>
        <LoginForm onSubmit={handleSubmit} submitting={submitting} serverError={error} />
        <div className="mt-4 text-center text-sm text-gray-500">
          <Link to={ADMIN_PATHS.FORGOT_PASSWORD} className="text-blue-600 hover:underline">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
