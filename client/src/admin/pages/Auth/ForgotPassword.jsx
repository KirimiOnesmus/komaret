import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';

import authService from '../../../shared/services/authService';
import { isValidEmail } from '../../../shared/validators/authValidators';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

import logo from '../../../assets/images/logo.svg';


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
      // Intentionally ignored.
    
    } finally {
      setSubmitting(false);
      setSubmitted(true);
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
                Account Recovery
              </p>

              <h1 className="mt-4 text-4xl font-bold leading-tight text-white xl:text-5xl">
                Get back into your
                <span className="text-[#f5b400]">
                  {' '}
                  Komaret account.
                </span>
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
                Enter the email address associated with your administration
                account and we'll send you instructions to securely reset
                your password.
              </p>

            </div>


  
            <div className="flex items-center gap-3 text-xs text-gray-500">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5b400]/10">
                <FaEnvelope className="text-[#f5b400]" />
              </div>

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

              {!submitted ? (

                <>
      
                  <div className="mb-8">

                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f5b400]/10">
                      <FaEnvelope className="text-lg text-[#f5b400]" />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                      Password Recovery
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-[#071525]">
                      Reset Your Password
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Enter your email address and we'll send you a
                      secure link to create a new password.
                    </p>

                  </div>


                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    noValidate
                  >

                    <Input
                      id="email"
                      label="Email address"
                      type="email"
                      autoComplete="username"
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={error}
                      required
                    />


                    <Button
                      type="submit"
                      disabled={submitting}
                      className="mt-1 w-full bg-[#f5b400] font-semibold text-[#071525] transition-colors hover:bg-[#dca300]"
                    >
                      {submitting
                        ? 'Sending...'
                        : 'Send reset link'}
                    </Button>

                  </form>
                </>

              ) : (

  
                <div className="py-5 text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-2xl text-green-600">
                    <FaCheckCircle />
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                    Check your inbox
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-[#071525]">
                    Reset Link Sent
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    If an account exists for that email address,
                    we've sent a password reset link. Please check
                    your inbox and follow the instructions.
                  </p>

                  <div className="mt-5 rounded-md bg-gray-50 px-4 py-3 text-xs text-gray-500">
                    The reset link may take a few minutes to arrive.
                    Don't forget to check your spam folder.
                  </div>

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

export default ForgotPassword;