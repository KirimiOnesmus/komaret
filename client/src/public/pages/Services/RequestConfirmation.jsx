import { useLocation, Link } from 'react-router-dom';
import { FaCheck, FaArrowRight, FaHome } from 'react-icons/fa';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';

function RequestConfirmation() {
  const location = useLocation();
  const reference = location.state?.reference;

  return (
    <div className="min-h-[60vh] bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-2xl items-center justify-center">
        <div className="w-full rounded-xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">

    
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f5b400]/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5b400]">
              <FaCheck className="text-2xl text-[#071525]" />
            </div>
          </div>

    
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
            Request Submitted
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#071525] sm:text-4xl">
            Thank You!
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
            Your service request has been successfully received.
            Our team will review your project requirements and get back
            to you shortly.
          </p>

    
          {reference && (
            <div className="mx-auto mt-7 max-w-sm rounded-lg border border-gray-200 bg-gray-50 px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Request Reference
              </p>

              <p className="mt-2 break-all font-mono text-lg font-bold text-[#071525]">
                {reference}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Keep this reference for future communication.
              </p>
            </div>
          )}

      
          <div className="mt-8 border-t border-gray-100 pt-7 text-left">
            <h2 className="text-sm font-bold text-[#071525]">
              What happens next?
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#f5b400]" />
                <p className="text-sm leading-6 text-gray-600">
                  Our team reviews your project requirements.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#f5b400]" />
                <p className="text-sm leading-6 text-gray-600">
                  We may contact you if we need additional information.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#f5b400]" />
                <p className="text-sm leading-6 text-gray-600">
                  A member of our team will get in touch to discuss the
                  next steps.
                </p>
              </div>
            </div>
          </div>

        
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={PUBLIC_PATHS.HOME}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#d99f00]"
            >
              <FaHome className="text-xs" />
              Back to Home
            </Link>

            <Link
              to={PUBLIC_PATHS.SERVICES}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#071525] px-6 py-3 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#071525] hover:text-white"
            >
              Explore Our Services
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RequestConfirmation;