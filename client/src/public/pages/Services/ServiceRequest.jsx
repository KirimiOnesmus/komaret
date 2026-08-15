import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaHardHat,
  FaPhoneAlt,
  FaShieldAlt,
} from 'react-icons/fa';

import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import useServiceRequest from '../../../shared/hooks/useServiceRequest';
import useServices from '../../../shared/hooks/useServices';

// import serviceRequestImage from '../../../assets/images/service-request.jpg';

const SERVICE_CONTENT = {
  'general-construction': {
    title: 'General Construction',
    description:
      'From residential developments to commercial buildings, our team manages construction projects from planning through completion.',
    points: [
      'Professional project management',
      'Quality construction materials',
      'Experienced technical teams',
      'End-to-end project delivery',
    ],
  },

  'interior-design': {
    title: 'Interior Design',
    description:
      'Create functional, modern and beautiful spaces with interior design solutions tailored to your property and lifestyle.',
    points: [
      'Concept and space planning',
      'Material and finish selection',
      'Residential and commercial interiors',
      'Complete interior execution',
    ],
  },

  renovation: {
    title: 'Renovation',
    description:
      'Transform existing spaces with carefully planned renovation and improvement works designed around your needs.',
    points: [
      'Residential renovations',
      'Commercial renovations',
      'Structural improvements',
      'Modernisation and refurbishment',
    ],
  },

  'machinery-hire': {
    title: 'Machinery Hire',
    description:
      'Access reliable construction machinery and equipment for your projects with flexible hire options.',
    points: [
      'Well-maintained equipment',
      'Flexible hire arrangements',
      'Reliable construction machinery',
      'Professional equipment support',
    ],
  },
};

function ServiceRequest() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { submit, submitting, error } = useServiceRequest();
  const { data: apiService } = useServices({ slug });

  const fallback =
    SERVICE_CONTENT[slug] || {
      title: 'Our Service',
      description:
        'Tell us about your project requirements and our team will help you determine the best solution.',
      points: [
        'Professional project support',
        'Quality workmanship',
        'Experienced team',
        'End-to-end service delivery',
      ],
    };

  // Prefer the real service (its name/description) but keep the marketing
  // bullet points from the fallback content for layout.
  const service = {
    title: apiService?.name || fallback.title,
    description: apiService?.description || apiService?.summary || fallback.description,
    points: fallback.points,
  };

  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
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

    const payload = {
      ...values,
      serviceId: apiService?.id,
      type: 'SERVICE',
    };

    const result = await submit(payload).catch(() => null);

    if (result?.errors) {
      setErrors(result.errors);
      return;
    }

    if (result?.data) {
      navigate(
        `/services/${encodeURIComponent(slug)}/confirmation`,
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

          {/* <img
            src={serviceRequestImage}
            alt=""
            className="h-full w-full object-cover"
          /> */}

          <div className="absolute inset-0 bg-[#071525]/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/85 to-[#071525]/35" />

        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">

        
          <div className="flex items-center gap-2 text-xs text-gray-300">

            <button
              type="button"
              onClick={() => navigate('/')}
              className="transition-colors hover:text-[#f5b400]"
            >
              Home
            </button>

            <span>›</span>

            <button
              type="button"
              onClick={() => navigate('/services')}
              className="transition-colors hover:text-[#f5b400]"
            >
              Services
            </button>

            <span>›</span>

            <span className="text-white">
              {service.title}
            </span>

          </div>

        
          <div className="mt-7 max-w-2xl">

            <p className="text-xs font-bold tracking-[0.18em] text-[#f5b400]">
              REQUEST A SERVICE
            </p>

            <h1 className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {service.title}
            </h1>

            <div className="mt-5 h-1 w-14 bg-[#f5b400]" />

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              Tell us about your requirements and our team will
              help you plan the right solution for your project.
            </p>

          </div>

        </div>
      </section>


      <section className="py-14 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.3fr] lg:items-start">



            <div>

              <p className="text-xs font-bold tracking-[0.15em] text-[#f5b400]">
                {service.title.toUpperCase()}
              </p>

              <h2 className="mt-2 text-3xl font-bold leading-tight text-[#071525]">
                Let&apos;s Discuss Your Project
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                {service.description}
              </p>


           
              <div className="mt-8 space-y-4">

                {service.points.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3"
                  >

                    <FaCheckCircle className="shrink-0 text-[#f5b400]" />

                    <span className="text-sm text-gray-600">
                      {point}
                    </span>

                  </div>
                ))}

              </div>


              <div className="mt-10">

                <h3 className="text-sm font-bold text-[#071525]">
                  Why Work With Us?
                </h3>

                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">

                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                      <FaHardHat />
                    </div>

                    <div>

                      <h4 className="text-sm font-bold text-[#071525]">
                        Experienced Team
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Skilled professionals focused on quality,
                        safety and reliable project delivery.
                      </p>

                    </div>

                  </div>


                  <div className="flex gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                      <FaShieldAlt />
                    </div>

                    <div>

                      <h4 className="text-sm font-bold text-[#071525]">
                        Quality & Transparency
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        Clear communication and dependable
                        workmanship throughout your project.
                      </p>

                    </div>

                  </div>

                </div>

              </div>


    
              <div className="mt-8 rounded-lg bg-[#071525] p-5">

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400] text-[#071525]">
                    <FaPhoneAlt className="text-sm" />
                  </div>

                  <div>

                    <p className="text-xs text-gray-400">
                      Need to speak with us?
                    </p>

                    <a
                      href="tel:+254700123456"
                      className="mt-1 block font-bold text-white hover:text-[#f5b400]"
                    >
                      +254 700 123 456
                    </a>

                  </div>

                </div>

              </div>

            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="border-b border-gray-100 pb-5">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="text-xl font-bold text-[#071525]">
                      Request {service.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Complete the form and our team will get back
                      to you.
                    </p>

                  </div>

                  <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400] sm:flex">
                    <FaHardHat />
                  </div>

                </div>

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


        
                <div className="mt-5">

                  <Input
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    maxLength={20}
                    value={values.phone}
                    onChange={handleChange('phone')}
                    error={errors.phone}
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
                    placeholder={`Tell us about your ${service.title.toLowerCase()} requirements...`}
                    className={`resize-none rounded-md border px-3 py-3 text-sm text-gray-700 placeholder:text-gray-400 
                      focus:outline-none focus:ring focus:ring-[#f5b400] focus:border-none ${
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
                    className="inline-flex items-center gap-2 bg-[#f5b400] px-6 py-3 
                    font-semibold text-[#071525] transition-colors hover:bg-[#dca200] cursor-pointer"
                  >
                    {submitting
                      ? 'Submitting...'
                      : 'Submit Request'}

                    {!submitting && (
                      <FaArrowRight className="text-xs" />
                    )}

                  </Button>

                </div>


                <p className="mt-4 text-xs leading-5 text-gray-400">
                  Our team will review your request and contact you
                  using the details provided.
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
              WHAT HAPPENS NEXT
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#071525]">
              A Simple Process
            </h2>

          </div>


          <div className="mt-10 grid gap-6 md:grid-cols-3">

  
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#071525] font-bold text-[#f5b400]">
                01
              </div>

              <h3 className="mt-5 font-bold text-[#071525]">
                Submit Your Request
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Tell us about your project and what you need from
                our team.
              </p>

            </div>



            <div className="rounded-lg bg-white p-6 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#071525] font-bold text-[#f5b400]">
                02
              </div>

              <h3 className="mt-5 font-bold text-[#071525]">
                We Contact You
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                A member of our team will contact you to understand
                your requirements in more detail.
              </p>

            </div>


   
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#071525] font-bold text-[#f5b400]">
                03
              </div>

              <h3 className="mt-5 font-bold text-[#071525]">
                We Get Started
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Once everything is agreed, we can move forward with
                your project.
              </p>

            </div>

          </div>

        </div>

      </section>


      <section className="bg-[#071525] py-12">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">

          <div>

            <p className="text-xs font-bold tracking-[0.15em] text-[#f5b400]">
              NEED MORE INFORMATION?
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              We&apos;re here to help.
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Speak directly with our team about your requirements.
            </p>

          </div>

          <a
            href="tel:+254700123456"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition-colors hover:bg-[#dca200]"
          >
            Call Our Team
            <FaPhoneAlt className="text-xs" />
          </a>

        </div>

      </section>

    </div>
  );
}

export default ServiceRequest;