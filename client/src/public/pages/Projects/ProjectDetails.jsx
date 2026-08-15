import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPhoneAlt,
} from 'react-icons/fa';

import Loading from '../../../shared/components/common/Loading';
import publicService from '../../../shared/services/publicService';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';


function ProjectDetails() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    publicService
      .getProjectBySlug(slug)
      .then(({ data }) => {
        if (active) {
          setProject(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.message || 'Unable to load this project.'
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);


  if (loading) {
    return <Loading label="Loading project..." />;
  }


  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }


  if (!project) {
    return null;
  }


  return (
    <div className="bg-white">


      <section className="relative bg-[#071525]">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      
          <div className="py-5">

            <div className="flex items-center gap-2 text-xs text-gray-400">

              <Link
                to={PUBLIC_PATHS.HOME}
                className="transition-colors hover:text-[#f5b400]"
              >
                Home
              </Link>

              <span>›</span>

              <Link
                to={PUBLIC_PATHS.PROJECTS}
                className="transition-colors hover:text-[#f5b400]"
              >
                Projects
              </Link>

              <span>›</span>

              <span className="truncate text-white">
                {project.title}
              </span>

            </div>

          </div>


   
          {project.coverImageUrl && (
            <div className="relative overflow-hidden rounded-t-xl">

              <img
                src={project.coverImageUrl}
                alt={project.title}
                className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#071525]/80 via-transparent to-transparent" />

            </div>
          )}

        </div>

      </section>


    
      <section className="py-14 sm:py-20">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">

    
            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                Our Project
              </p>


              <h1 className="mt-2 text-3xl font-bold leading-tight text-[#071525] sm:text-4xl">
                {project.title}
              </h1>


              {project.location && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">

                  <FaMapMarkerAlt className="text-[#f5b400]" />

                  <span>
                    {project.location}
                  </span>

                </div>
              )}


              <div className="mt-6 h-1 w-12 bg-[#f5b400]" />


              {project.description && (
                <div className="mt-8">

                  <h2 className="text-xl font-bold text-[#071525]">
                    Project Overview
                  </h2>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                    {project.description}
                  </p>

                </div>
              )}


           
              <div className="mt-10">

                <h2 className="text-xl font-bold text-[#071525]">
                  Why choose Komaret?
                </h2>


                <div className="mt-6 grid gap-5 sm:grid-cols-2">

                  <div className="flex gap-3">

                    <FaCheckCircle className="mt-1 shrink-0 text-[#f5b400]" />

                    <div>
                      <h3 className="text-sm font-semibold text-[#071525]">
                        Quality workmanship
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        We maintain high standards throughout every stage
                        of the project.
                      </p>
                    </div>

                  </div>


                  <div className="flex gap-3">

                    <FaCheckCircle className="mt-1 shrink-0 text-[#f5b400]" />

                    <div>
                      <h3 className="text-sm font-semibold text-[#071525]">
                        Professional delivery
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        Our experienced team manages projects with care
                        and attention to detail.
                      </p>
                    </div>

                  </div>


                  <div className="flex gap-3">

                    <FaCheckCircle className="mt-1 shrink-0 text-[#f5b400]" />

                    <div>
                      <h3 className="text-sm font-semibold text-[#071525]">
                        Reliable service
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        We work closely with our clients to ensure their
                        expectations are met.
                      </p>
                    </div>

                  </div>


                  <div className="flex gap-3">

                    <FaCheckCircle className="mt-1 shrink-0 text-[#f5b400]" />

                    <div>
                      <h3 className="text-sm font-semibold text-[#071525]">
                        End-to-end support
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        From planning to completion, our team is there
                        throughout the project.
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


                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Like what you see?
                  </h2>


                  <p className="mt-4 text-sm leading-6 text-gray-400">
                    Talk to our team about your next construction,
                    renovation, design, or development project.
                  </p>


                  <div className="mt-7 space-y-3">

                    <Link
                      to={PUBLIC_PATHS.QUOTE}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-[#f5b400] px-5 py-3 text-sm font-bold text-[#071525] transition-colors hover:bg-[#dca200]"
                    >
                      Request a Quote

                      <FaArrowRight className="text-xs" />
                    </Link>


                    <Link
                      to={PUBLIC_PATHS.CONTACT}
                      className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#f5b400] hover:text-[#f5b400]"
                    >
                      <FaPhoneAlt className="text-xs" />

                      Contact Us
                    </Link>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </section>


  
      <section className="bg-gray-50 py-14 sm:py-16">

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
            Have a project in mind?
          </p>


          <h2 className="mt-2 text-3xl font-bold text-[#071525]">
            Let's build something great together.
          </h2>


          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600">
            Tell us about your project and our team will help you turn
            your ideas into reality.
          </p>


          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to={PUBLIC_PATHS.QUOTE}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#f5b400] px-6 py-3 text-sm font-bold text-[#071525] transition-colors hover:bg-[#dca200]"
            >
              Get a Quote

              <FaArrowRight className="text-xs" />
            </Link>


            <Link
              to={PUBLIC_PATHS.PROJECTS}
              className="inline-flex items-center justify-center rounded-md border border-[#071525] px-6 py-3 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#071525] hover:text-white"
            >
              View More Projects
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


export default ProjectDetails;