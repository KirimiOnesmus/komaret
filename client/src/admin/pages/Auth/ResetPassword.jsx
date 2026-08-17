import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaLock } from 'react-icons/fa';

import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';

import authService from '../../../shared/services/authService';

import {
  isStrongPassword,
  passwordsMatch,
} from '../../../shared/validators/authValidators';

import { ADMIN_PATHS } from '../../../shared/constants/routes';

import logo from '../../../assets/images/logo.svg';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
      next.password =
        'Use at least 8 characters, including a letter and a number.';
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
      setServerError(
        'This reset link is invalid or has expired.'
      );
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    try {
      await authService.resetPassword(token, password);

      setDone(true);

      setTimeout(() => {
        navigate(ADMIN_PATHS.LOGIN, {
          replace: true,
        });
      }, 2000);
    } catch {
      setServerError(
        'This reset link is invalid or has expired.'
      );
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

            <img
              src={logo}
              alt="Komaret"
              className="h-16 w-auto brightness-0 invert"
            />

            <div className="max-w-lg">
              <div className="mb-6 h-1 w-12 bg-[#f5b400]" />

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5b400]">
                Account Security
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight text-white xl:text-5xl">
                Create a new,
                <span className="text-[#f5b400]">
                  {' '}
                  secure password.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
                Choose a strong password to keep your Komaret
                administration account protected.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <FaLock className="text-[#f5b400]" />
              Secure password recovery
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

            <div className="rounded-xl border border-gray-200 bg-white p-7 sm:p-9">

              {!done ? (
                <>
                  <div className="mb-8">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                      Password Recovery
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#071525]">
                      Set a New Password
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Enter your new password below. Make sure it is
                      strong and easy for you to remember.
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    noValidate
                  >
                    <Input
                      id="password"
                      label="New password"
                      type="password"
                      autoComplete="new-password"
                      maxLength={128}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
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
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      error={errors.confirmPassword}
                      required
                    />

                    {serverError && (
                      <div
                        role="alert"
                        className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        {serverError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="mt-1 w-full bg-[#f5b400] font-semibold text-[#071525] transition-colors hover:bg-[#dca300]"
                    >
                      {submitting
                        ? 'Updating...'
                        : 'Update password'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="py-5 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl text-green-600">
                    <FaCheckCircle />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-[#071525]">
                    Password Updated
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    Your password has been successfully updated.
                    You will be redirected to the sign-in page
                    shortly.
                  </p>

                </div>
              )}

              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                <Link
                  to={ADMIN_PATHS.LOGIN}
                  className="text-sm font-medium text-[#071525] transition-colors hover:text-[#f5b400]"
                >
                  Back to sign in
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

export default ResetPassword;