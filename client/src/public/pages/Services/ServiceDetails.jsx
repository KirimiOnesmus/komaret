import { useParams, Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCalculator,
  FaCheckCircle,
  FaHardHat,
} from 'react-icons/fa';

import Loading from '../../../shared/components/common/Loading';
import useServices from '../../../shared/hooks/useServices';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';


function ServiceDetails() {
  const { slug } = useParams();

  const {
    data: service,
    loading,
    error,
  } = useServices({ slug });


  if (loading) {
    return <Loading label="Loading service..." />;
  }


  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-sm text-red-600 sm:px-6 lg:px-8">
        {error}
      </div>
    );
  }


  if (!service) {
    return null;
  }


  const requestUrl = `/services/${encodeURIComponent(slug)}/request`;
  const estimateUrl = `/services/${encodeURIComponent(slug)}/estimate`;


  return (
    <div className="bg-white">


      <section className="relative overflow-hidden bg-[#071525]">

  


        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">


          <div className="flex items-center gap-2 text-xs text-gray-400">

            <Link
              to={PUBLIC_PATHS.HOME}
              className="transition-colors hover:text-[#f5b400] cursor-pointer"
            >
              Home
            </Link>

            <span>›</span>

            <Link
              to={PUBLIC_PATHS.SERVICES}
              className="transition-colors hover:text-[#f5b400] cursor-pointer"
            >
              Services
            </Link>

            <span>›</span>

            <span className="text-white">
              {service.title}
            </span>

          </div>


          <div className="mt-10 max-w-3xl">

            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#f5b400] text-[#071525]">
              <FaHardHat className="text-2xl" />
            </div>


            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#f5b400]">
              Our Services
            </p>


            <h1 className="mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {service.title}
            </h1>


            <div className="mt-5 h-1 w-12 bg-[#f5b400]" />


            {service.description && (
              <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
                {service.description}
              </p>
            )}


            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                to={requestUrl}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm
                 font-bold text-[#071525] transition-colors hover:bg-[#dca200] cursor-pointer"
              >
                Request This Service
                <FaArrowRight className="text-xs" />
              </Link>


              <Link
                to={estimateUrl}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-6 py-3 cursor-pointer
                 text-sm font-semibold text-white transition-colors hover:border-[#f5b400] hover:text-[#f5b400]"
              >
                <FaCalculator className="text-xs" />
                Get Instant Estimate
              </Link>

            </div>

          </div>

        </div>
      </section>



      <section className="py-16 sm:py-20">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">


            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                About This Service
              </p>


              <h2 className="mt-2 text-3xl font-bold text-[#071525]">
                Professional solutions built around your needs
              </h2>


              {service.description && (
                <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base">
                  {service.description}
                </p>
              )}


              <div className="mt-8 h-px bg-gray-200" />


              <div className="mt-8">

                <h3 className="text-lg font-bold text-[#071525]">
                  Why choose this service?
                </h3>


                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                      <FaCheckCircle />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#071525]">
                        Professional expertise
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Experienced professionals handle your project from
                        planning through completion.
                      </p>
                    </div>
                  </div>


                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                      <FaCheckCircle />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#071525]">
                        Quality workmanship
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        We maintain high standards throughout every stage of
                        the project.
                      </p>
                    </div>
                  </div>


                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                      <FaCheckCircle />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#071525]">
                        End-to-end delivery
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        One team manages the process from the initial
                        assessment to final handover.
                      </p>
                    </div>
                  </div>


                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                      <FaCheckCircle />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#071525]">
                        Client-focused approach
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        We work closely with you to understand your goals and
                        deliver the right solution.
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>


            <aside>

              <div className="sticky top-28 overflow-hidden rounded-xl bg-[#071525]">

                <div className="h-1 bg-[#f5b400]" />

                <div className="p-7">

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                    Start Your Project
                  </p>


                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Ready to get started?
                  </h3>


                  <p className="mt-4 text-sm leading-6 text-gray-400">
                    Tell us about your project and our team will help you
                    determine the best approach.
                  </p>


                  <div className="mt-7 space-y-3">

                    <Link
                      to={requestUrl}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f5b400] px-5 py-3
                       text-sm font-bold text-[#071525] transition-colors hover:bg-[#dca200] cursor-pointer"
                    >
                      Request This Service
                      <FaArrowRight className="text-xs" />
                    </Link>


                    <Link
                      to={estimateUrl}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-600 px-5 py-3 cursor-pointer 
                      text-sm font-semibold text-white transition-colors hover:border-[#f5b400] hover:text-[#f5b400]"
                    >
                      <FaCalculator className="text-xs" />
                      Get an Instant Estimate
                    </Link>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </section>


   
      <section className="bg-gray-50 py-14">

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
            Let's Work Together
          </p>


          <h2 className="mt-2 text-3xl font-bold text-[#071525]">
            Have a project in mind?
          </h2>


          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            Whether you are planning a new project, renovation, or need
            professional services, our team is ready to help.
          </p>


          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to={requestUrl}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition-colors hover:bg-[#dca200]"
            >
              Request a Quote
              <FaArrowRight className="text-xs" />
            </Link>


            <Link
              to={PUBLIC_PATHS.CONTACT}
              className="inline-flex items-center justify-center rounded-md border border-[#071525] px-6 py-3 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#071525] hover:text-white"
            >
              Contact Us
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


export default ServiceDetails;