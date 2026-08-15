import { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  FaCalculator,
  FaRulerCombined,
  FaCheckCircle,
  FaArrowRight,
  FaHardHat,
  FaPalette,
  FaTools,
  FaTruck,
} from 'react-icons/fa';

import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import useServiceRequest from '../../../shared/hooks/useServiceRequest';
import { formatCurrency } from '../../../shared/utils/formatters';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';



const SERVICE_CONFIG = {
  'general-construction': {
    title: 'General Construction',
    description:
      'Get a preliminary estimate for your construction project based on project size and finish level.',
    icon: FaHardHat,
    unitLabel: 'Approximate project size',
    unitPlaceholder: 'e.g. 250',
    unitSuffix: 'm²',
    scopeLabel: 'Construction finish',
    scopes: [
      { value: 'basic', label: 'Basic / standard finish' },
      { value: 'standard', label: 'Mid-range finish' },
      { value: 'premium', label: 'Premium / high-end finish' },
    ],
  },

  'interior-design': {
    title: 'Interior Design',
    description:
      'Get a preliminary estimate for your interior design project based on the space and design level.',
    icon: FaPalette,
    unitLabel: 'Approximate space',
    unitPlaceholder: 'e.g. 120',
    unitSuffix: 'm²',
    scopeLabel: 'Design level',
    scopes: [
      { value: 'basic', label: 'Basic interior package' },
      { value: 'standard', label: 'Standard interior package' },
      { value: 'premium', label: 'Premium interior package' },
    ],
  },

  renovation: {
    title: 'Renovation',
    description:
      'Tell us the approximate size of the area you want to renovate and the level of renovation required.',
    icon: FaTools,
    unitLabel: 'Approximate renovation area',
    unitPlaceholder: 'e.g. 100',
    unitSuffix: 'm²',
    scopeLabel: 'Renovation scope',
    scopes: [
      { value: 'basic', label: 'Minor renovation' },
      { value: 'standard', label: 'Standard renovation' },
      { value: 'premium', label: 'Major / premium renovation' },
    ],
  },

  'machinery-hire': {
    title: 'Machinery Hire',
    description:
      'Get a preliminary estimate based on the machinery requirement and expected usage.',
    icon: FaTruck,
    unitLabel: 'Duration',
    unitPlaceholder: 'e.g. 5',
    unitSuffix: 'days',
    scopeLabel: 'Equipment requirement',
    scopes: [
      { value: 'basic', label: 'Standard equipment' },
      { value: 'standard', label: 'Heavy equipment' },
      { value: 'premium', label: 'Specialized equipment' },
    ],
  },
};



function EstimateResult() {
  const { slug } = useParams();
  const location = useLocation();

  const {
    requestEstimate,
    estimating,
    error,
  } = useServiceRequest();

  const service = SERVICE_CONFIG[slug] || {
    title: 'Project Service',
    description:
      'Provide some details about your project to receive a preliminary estimate.',
    icon: FaCalculator,
    unitLabel: 'Approximate size',
    unitPlaceholder: 'e.g. 100',
    unitSuffix: 'm²',
    scopeLabel: 'Project level',
    scopes: [
      { value: 'basic', label: 'Basic' },
      { value: 'standard', label: 'Standard' },
      { value: 'premium', label: 'Premium' },
    ],
  };

  const ServiceIcon = service.icon;

  const [estimate, setEstimate] = useState(
    location.state?.estimate ?? null
  );

  const [values, setValues] = useState({
    size: '',
    scope: 'standard',
    notes: '',
  });

  const handleChange = (field) => (e) => {
    setValues((current) => ({
      ...current,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await requestEstimate({

      serviceSlug: slug,

      size: values.size
        ? Number(values.size)
        : undefined,

      scope: values.scope,

      notes: values.notes,
    }).catch(() => null);

    if (data) {
      setEstimate(data);
    }
  };




  if (estimate) {
    return (
      <div className="bg-white">

        <section className="relative overflow-hidden bg-[#071525]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/95 to-[#071525]/80" />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Link
                to={PUBLIC_PATHS.HOME}
                className="hover:text-[#f5b400]"
              >
                Home
              </Link>

              <span>›</span>

              <Link
                to={`/services/${encodeURIComponent(slug)}`}
                className="hover:text-[#f5b400]"
              >
                {service.title}
              </Link>

              <span>›</span>

              <span className="text-white">
                Estimate
              </span>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f5b400] text-[#071525]">
                <ServiceIcon className="text-2xl" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                  Your Estimate
                </p>

                <h1 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
                  {service.title}
                </h1>
              </div>
            </div>

          </div>
        </section>



        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                <FaCheckCircle className="text-3xl" />
              </div>

              <p className="mt-6 text-sm font-medium text-gray-500">
                Preliminary estimate for
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#071525]">
                {service.title}
              </h2>

              <div className="mt-8 rounded-lg bg-[#071525] px-6 py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Estimated Project Cost
                </p>

                <p className="mt-3 text-4xl font-bold text-[#f5b400] sm:text-5xl">
                  {formatCurrency(estimate.amount)}
                </p>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">
                  This is a preliminary estimate based on the information
                  provided. The final price may change after our team reviews
                  your project requirements.
                </p>
              </div>

              <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">
                    Service
                  </p>

                  <p className="mt-1 font-semibold text-[#071525]">
                    {service.title}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">
                    Project size
                  </p>

                  <p className="mt-1 font-semibold text-[#071525]">
                    {values.size
                      ? `${values.size} ${service.unitSuffix}`
                      : 'Not specified'}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-xs text-gray-500">
                    Project level
                  </p>

                  <p className="mt-1 font-semibold capitalize text-[#071525]">
                    {values.scope}
                  </p>
                </div>

              </div>


              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={() => setEstimate(null)}
                  className="rounded-md border border-gray-300 px-6 py-3 text-sm font-semibold text-[#071525] transition hover:bg-gray-50"
                >
                  Adjust Estimate
                </button>

                <Link
                  to={`/services/${encodeURIComponent(slug)}/request`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition hover:bg-[#dca200] sm:w-auto"
                  >
                    Request Full Quote
                    <FaArrowRight />
                  </button>
                </Link>

              </div>

            </div>

          </div>
        </section>

      </div>
    );
  }




  return (
    <div className="bg-white">

      <section className="relative overflow-hidden bg-[#071525]">

        <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/95 to-[#071525]/80" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">


          <div className="flex items-center gap-2 text-xs text-gray-400">

            <Link
              to={PUBLIC_PATHS.HOME}
              className="hover:text-[#f5b400] cursor-pointer"
            >
              Home
            </Link>

            <span>›</span>

            <Link
              to={`/services/${encodeURIComponent(slug)}`}
              className="hover:text-[#f5b400] cursor-pointer"
            >
              {service.title}
            </Link>

            <span>›</span>

            <span className="text-white">
              Estimate
            </span>

          </div>


          <div className="mt-8 max-w-2xl">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#f5b400] text-[#071525]">
                <ServiceIcon className="text-2xl" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                  Instant Estimate
                </p>

                <h1 className="mt-1 text-3xl font-bold text-white sm:text-5xl">
                  {service.title}
                </h1>
              </div>

            </div>

            <div className="mt-5 h-1 w-12 bg-[#f5b400]" />

            <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base">
              {service.description}
            </p>

          </div>

        </div>
      </section>


  
      <section className="py-14 sm:py-20">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">


      
            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                How It Works
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#071525]">
                Get a quick project estimate
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                Provide a few basic details about your project and our system
                will calculate a preliminary estimate specifically for{' '}
                <strong>{service.title}</strong>.
              </p>


              <div className="mt-8 space-y-5">

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                    <span className="font-bold">1</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#071525]">
                      Tell us about your project
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Enter the approximate size and project requirements.
                    </p>
                  </div>
                </div>


                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                    <span className="font-bold">2</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#071525]">
                      We calculate the estimate
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Your inputs are evaluated against the pricing rules for
                      this service.
                    </p>
                  </div>
                </div>


                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                    <span className="font-bold">3</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#071525]">
                      Request a detailed quote
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Our team can review your project and provide a formal
                      quotation.
                    </p>
                  </div>
                </div>

              </div>

            </div>


            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#071525]">
                  Project Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Estimating: <strong>{service.title}</strong>
                </p>
              </div>


              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >

   
                <div>

                  <Input
                    id="size"
                    label={service.unitLabel}
                    type="number"
                    min="0"
                    value={values.size}
                    onChange={handleChange('size')}
                    placeholder={service.unitPlaceholder}
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Unit: {service.unitSuffix}
                  </p>

                </div>


  
                <Select
                  id="scope"
                  label={service.scopeLabel}
                  options={service.scopes}
                  value={values.scope}
                  onChange={handleChange('scope')}
                />



                <div className="flex flex-col gap-1">

                  <label
                    htmlFor="notes"
                    className="text-sm font-medium text-gray-700"
                  >
                    Additional project details
                  </label>

                  <textarea
                    id="notes"
                    rows={5}
                    maxLength={2000}
                    value={values.notes}
                    onChange={handleChange('notes')}
                    placeholder="Tell us anything else that may help us understand your project..."
                    className="rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-900 outline-none transition
                     focus:border-[#f5b400] focus:ring focus:ring-[#f5b400]/20 focus:border-none"
                  />

                  <p className="text-right text-xs text-gray-400">
                    {values.notes.length}/2000
                  </p>

                </div>


                {error && (
                  <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}



                <button
                  type="submit"
                  disabled={estimating}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold
                   text-[#071525] transition hover:bg-[#dca200] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                >
                  <FaCalculator />

                  {estimating
                    ? 'Calculating Estimate...'
                    : 'Calculate Estimate'}
                </button>


                <p className="text-center text-xs leading-5 text-gray-400">
                  Estimates are indicative only and are not a binding quotation.
                  Final pricing will be confirmed after project assessment.
                </p>

              </form>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


export default EstimateResult;