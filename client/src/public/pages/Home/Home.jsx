import { Link } from "react-router-dom";

import Button from "../../../shared/components/common/Button";
import Loading from "../../../shared/components/common/Loading";
import useServices from "../../../shared/hooks/useServices";
import { ServiceCard, ProjectCard } from "../../features";
import {HomeSlider, Testimonials} from "../../features";
import {
  FaArrowRight,
  FaAward,
  FaBuilding,
  FaUsers,
  FaHandshake,
  FaLongArrowAltRight,
} from "react-icons/fa";

import { PUBLIC_PATHS } from "../../../shared/constants/routes";

function Home() {
  const {
    data: services,
    loading,
    error,
  } = useServices({
    params: {
      limit: 3,
    },
  });

  return (
    <div>
      <HomeSlider />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[#f5b400]">
              WHAT WE DO
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#071525]">
              Our Services
            </h2>
          </div>

          <Link
            to={PUBLIC_PATHS.SERVICES}
            className=" flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
          >
            <span>View all services</span> <FaLongArrowAltRight />
          </Link>
        </div>

        {loading && <Loading label="Loading services..." />}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        )}
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[#f5b400]">
              OUR WORK
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#071525]">
              Featured Projects
            </h2>
          </div>

          <Link
            to={PUBLIC_PATHS.PROJECTS}
            className=" flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline "
          >
            <span>View all projects </span>
            <FaLongArrowAltRight />
          </Link>
        </div>
        {loading && <Loading label="Loading projects..." />}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ProjectCard key={service.slug} service={service} />
            ))}
          </div>
        )}
      </section>
      <section className="relative overflow-hidden bg-[rgb(7,21,37)] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(7,21,37,0.98),rgba(7,21,37,0.92),rgba(7,21,37,0.85))]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                Why Choose Us
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                We Deliver
                <br />
                Excellence
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-6 text-gray-300">
                With a passion for quality and a commitment to our clients, we
                turn ideas into lasting value. From concept to completion, we
                deliver reliable construction solutions you can trust.
              </p>

              <Link
                to={PUBLIC_PATHS.ABOUT}
                className="group mt-7 inline-flex items-center gap-3 bg-[#f5b400] px-5 py-3 text-sm font-semibold text-[#071525] transition-all duration-200 hover:bg-[#dca500]"
              >
                <span>About Us</span>

                <FaArrowRight className="text-xs transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
              <div className="group">
                <FaAward className="mb-5 text-4xl text-[#f5b400] transition-transform duration-300 group-hover:scale-110" />

                <div className="text-4xl font-bold sm:text-5xl">5+</div>

                <p className="mt-2 text-sm font-semibold text-white">
                  Years Experience
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Delivering construction excellence since 2021.
                </p>
              </div>

              <div className="group">
                <FaBuilding className="mb-5 text-4xl text-[#f5b400] transition-transform duration-300 group-hover:scale-110" />

                <div className="text-4xl font-bold sm:text-5xl">100+</div>

                <p className="mt-2 text-sm font-semibold text-white">
                  Projects Completed
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Successfully delivered projects across Kenya.
                </p>
              </div>

              <div className="group">
                <FaUsers className="mb-5 text-4xl text-[#f5b400] transition-transform duration-300 group-hover:scale-110" />

                <div className="text-4xl font-bold sm:text-5xl">50+</div>

                <p className="mt-2 text-sm font-semibold text-white">
                  Skilled Professionals
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  Engineers, designers and support staff.
                </p>
              </div>

              <div className="group">
                <FaHandshake className="mb-5 text-4xl text-[#f5b400] transition-transform duration-300 group-hover:scale-110" />

                <div className="text-4xl font-bold sm:text-5xl">98%</div>

                <p className="mt-2 text-sm font-semibold text-white">
                  Client Satisfaction
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  We build relationships that last.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[#f5b400]">
              TESTIMONIALS
            </p>
            <h2 className="mt-2 text-3xl font-bold text-[#071525]">
              What Our Client Says
            </h2>
          </div>
                 <Link
            to={PUBLIC_PATHS.CONTACT}
            className=" flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline "
          >
            <span>Give Us Feedback </span>
            <FaLongArrowAltRight />
          </Link>
        </div>
        <div>
          <Testimonials/>
        </div>
      </section>
    </div>
  );
}

export default Home;
