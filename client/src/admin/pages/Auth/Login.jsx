import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

import useAuth from '../../../shared/hooks/useAuth';
import LoginForm from './LoginForm';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

import logo from '../../../assets/images/logo.svg';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const from =
    location.state?.from?.pathname || ADMIN_PATHS.DASHBOARD;

  const handleSubmit = async ({ email, password }) => {
    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071525]">
      <div className="grid min-h-screen lg:grid-cols-2">

      
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-[#071525]" />

          
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#f5b400]/10" />
          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#f5b400]/5" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            <div>
              <img
                src={logo}
                alt="Komaret"
                className="h-16 w-auto brightness-0 invert"
              />
            </div>

            <div className="max-w-lg">
              <div className="mb-6 h-1 w-12 bg-[#f5b400]" />

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5b400]">
                Administration Portal
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight text-white xl:text-5xl">
                Manage your projects,
                <span className="text-[#f5b400]"> services</span> and
                <span className="text-[#f5b400]"> clients.</span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
                Access the Komaret administration portal to manage your
                construction projects, services, enquiries and company
                content.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <FaShieldAlt className="text-[#f5b400]" />
              Secure administration portal
            </div>
          </div>
        </div>

    
        <div className="flex items-center justify-center bg-[#f7f8fa] px-4 py-10 sm:px-6 lg:px-12">
          <div className="w-full max-w-md">

   
            <div className="mb-8 flex justify-center lg:hidden">
              <img
                src={logo}
                alt="Komaret"
                className="h-14 w-auto"
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-xl sm:p-9">

              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                  Welcome back
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#071525]">
                  Admin Sign In
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Sign in to access the Komaret administration dashboard.
                </p>
              </div>

              <LoginForm
                onSubmit={handleSubmit}
                submitting={submitting}
                serverError={error}
              />

              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                <Link
                  to={ADMIN_PATHS.FORGOT_PASSWORD}
                  className="text-sm font-medium text-[#071525] transition-colors hover:text-[#f5b400]"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Link
              to="/"
              className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 transition-colors hover:text-[#071525]"
            >
              <FaArrowLeft />
              Back to website
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;