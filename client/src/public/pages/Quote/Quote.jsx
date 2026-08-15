import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaHardHat,
  FaPhoneAlt,
  FaShieldAlt,
} from 'react-icons/fa';

import Input from '../../../shared/components/common/Input';
import Select from '../../../shared/components/common/Select';
import Button from '../../../shared/components/common/Button';
import useServiceRequest from '../../../shared/hooks/useServiceRequest';

import quoteImage from '../../../assets/images/projects.jpg';

const SERVICE_OPTIONS = [
  { value: 'general-construction', label: 'General Construction' },
  { value: 'interior-design', label: 'Interior Design' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'machinery-hire', label: 'Machinery Hire' },
];

const BENEFITS = [
  {
    icon: FaCheckCircle,
    title: 'Free Consultation',
    text: 'Discuss your project with our team before making any commitment.',
  },
  {
    icon: FaShieldAlt,
    title: 'Transparent Pricing',
    text: 'Receive a clear quotation with no hidden or unexpected costs.',
  },
  {
    icon: FaClock,
    title: 'Quick Response',
    text: 'Our team will review your request and get back to you promptly.',
  },
];

function Quote() {
  const navigate = useNavigate();

  const { submit, submitting, error } = useServiceRequest();

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    serviceSlug: SERVICE_OPTIONS[0].value,
    details: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((v) => ({
      ...v,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const result = await submit(values).catch(() => null);

    if (result?.errors) {
      setErrors(result.errors);
      return;
    }

    if (result?.data) {
      navigate(
        `/services/${encodeURIComponent(
          values.serviceSlug
        )}/confirmation`,
        {
          state: {
            reference: result.data.reference,
          },
        }
      );
    }
  };

  return (
    <div className="bg-white">

      <section className="relative overflow-hidden bg-[#071525]">

   
        <div className="absolute inset-0">
          <img
            src={quoteImage}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#071525]/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/85 to-[#071525]/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

      
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="transition-colors hover:text-[#f5b400] cursor-pointer"
            >
              Home
            </button>

            <span>›</span>

            <span className="text-white">
              Get a Quote
            </span>
          </div>

       
          <div className="mt-7 max-w-2xl">

            <p className="text-xs font-bold tracking-[0.18em] text-[#f5b400]">
              START YOUR PROJECT
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s Build Something Great Together
            </h1>

            <div className="mt-5 h-1 w-14 bg-[#f5b400]" />

            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              Tell us about your construction, renovation, design, or
              machinery requirements and our team will prepare a
              tailored quotation for your project.
            </p>

          </div>

        </div>
      </section>



      <section className="py-14 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.35fr] lg:items-start">


      
            <div>

              <p className="text-xs font-bold tracking-[0.15em] text-[#f5b400]">
                REQUEST A QUOTE
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#071525]">
                Tell Us About Your Project
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                Every project is different. Give us a few details about
                what you have in mind and our team will help you determine
                the right approach, scope, and estimated cost.
              </p>


              <div className="mt-8 space-y-5">

                {BENEFITS.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <div
                      key={benefit.title}
                      className="flex gap-4"
                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                        <Icon />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#071525]">
                          {benefit.title}
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          {benefit.text}
                        </p>
                      </div>

                    </div>
                  );
                })}

              </div>


              <div className="mt-8 rounded-lg bg-[#071525] p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400] text-[#071525]">
                    <FaPhoneAlt className="text-sm" />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-gray-300">
                      Prefer to talk to us?
                    </p>

                    <a
                      href="tel:+254700123456"
                      className="mt-1 block text-lg font-bold text-white transition-colors hover:text-[#f5b400]"
                    >
                      +254 700 123 456
                    </a>

                    <p className="mt-1 text-xs text-gray-400">
                      Mon - Sat: 8:00 AM - 6:00 PM
                    </p>

                  </div>

                </div>

              </div>

            </div>



            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="border-b border-gray-100 pb-5">

                <h3 className="text-xl font-bold text-[#071525]">
                  Request Your Free Quote
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Fill in the form below and our team will contact you.
                </p>

              </div>


              <form
                onSubmit={handleSubmit}
                className="mt-6"
                noValidate
              >

   
                <div className="grid gap-5 sm:grid-cols-2">

                  <Input
                    id="name"
                    label="Full Name"
                    maxLength={150}
                    value={values.name}
                    onChange={handleChange('name')}
                    error={errors.name}
                    required
                  />

                  <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    maxLength={254}
                    value={values.email}
                    onChange={handleChange('email')}
                    error={errors.email}
                    required
                  />

                </div>



                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  <Input
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    maxLength={20}
                    value={values.phone}
                    onChange={handleChange('phone')}
                    error={errors.phone}
                  />

                  <Select
                    id="serviceSlug"
                    label="Service"
                    options={SERVICE_OPTIONS}
                    value={values.serviceSlug}
                    onChange={handleChange('serviceSlug')}
                  />

                </div>



                <div className="mt-5 flex flex-col gap-1">

                  <label
                    htmlFor="details"
                    className="text-sm font-medium text-gray-700"
                  >
                    Project Details
                  </label>

                  <textarea
                    id="details"
                    rows={7}
                    maxLength={2000}
                    value={values.details}
                    onChange={handleChange('details')}
                    placeholder="Tell us about your project, location, estimated size, timeline, budget or any other details that may help us understand your requirements..."
                    className={`resize-none rounded-md border px-3 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring focus:ring-[#f5b400] focus:border-none ${
                      errors.details
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />

                  {errors.details && (
                    <span className="text-xs text-red-600">
                      {errors.details}
                    </span>
                  )}

                  <p className="mt-1 text-right text-[11px] text-gray-400">
                    {values.details.length}/2000
                  </p>

                </div>


   
                {error && (
                  <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-3">
                    <p
                      role="alert"
                      className="text-sm text-red-600"
                    >
                      {error}
                    </p>
                  </div>
                )}



                <div className="mt-6">

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-[#f5b400] px-6 py-3 font-semibold text-[#071525] 
                    transition-colors hover:bg-[#dca200] cursor-pointer"
                  >
                    {submitting
                      ? 'Submitting...'
                      : 'Request Quote'}

                    {!submitting && (
                      <FaArrowRight className="text-xs" />
                    )}
                  </Button>

                </div>


                <p className="mt-4 text-xs leading-5 text-gray-400">
                  By submitting this form, you agree that our team may
                  contact you regarding your project enquiry.
                </p>

              </form>

            </div>

          </div>

        </div>

      </section>



      <section className="bg-gray-50 py-14 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-xs font-bold tracking-[0.15em] text-[#f5b400]">
              HOW IT WORKS
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#071525]">
              From Idea to Project
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Our straightforward process makes it easy to move from
              your initial enquiry to a clear project plan.
            </p>

          </div>


          <div className="mt-10 grid gap-6 md:grid-cols-3">


            <div className="relative rounded-lg bg-white p-6 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#071525] text-lg font-bold text-[#f5b400]">
                01
              </div>

              <h3 className="mt-5 font-bold text-[#071525]">
                Tell Us What You Need
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Submit your project requirements through our quote
                form and give us as much detail as possible.
              </p>

            </div>


        
            <div className="relative rounded-lg bg-white p-6 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#071525] text-lg font-bold text-[#f5b400]">
                02
              </div>

              <h3 className="mt-5 font-bold text-[#071525]">
                We Review Your Project
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Our specialists assess your requirements and contact
                you to clarify any important details.
              </p>

            </div>


            <div className="relative rounded-lg bg-white p-6 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#071525] text-lg font-bold text-[#f5b400]">
                03
              </div>

              <h3 className="mt-5 font-bold text-[#071525]">
                Receive Your Quote
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                We prepare a clear quotation tailored to your project
                and discuss the next steps with you.
              </p>

            </div>

          </div>

        </div>

      </section>


    </div>
  );
}

export default Quote;