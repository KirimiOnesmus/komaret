import {
  FaAward,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaGem,
  FaHandshake,
  FaCheckCircle,
  FaBuilding,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { PUBLIC_PATHS } from '../../../shared/constants/routes';
import buildingImage from '../../../assets/images/banner.png';
import Greeting from '../../../assets/images/greetings.png'


const REASONS = [
  {
    title: 'Experience & Expertise',
    body: 'Over 10 years of hands-on experience delivering diverse construction and infrastructure projects.',
    icon: FaAward,
  },
  {
    title: 'Skilled Professionals',
    body: 'Our team of engineers, project managers and specialists are passionate about delivering excellence.',
    icon: FaUsers,
  },
  {
    title: 'Quality Assurance',
    body: 'We adhere to the highest standards of quality at every phase of our projects.',
    icon: FaShieldAlt,
  },
  {
    title: 'Timely Delivery',
    body: 'We value your time and are committed to delivering projects on schedule and within budget.',
    icon: FaClock,
  },
  {
    title: 'Client-Centered Approach',
    body: 'We listen, collaborate and tailor solutions to meet our clients’ unique needs.',
    icon: FaGem,
  },
  {
    title: 'Integrity & Transparency',
    body: 'We build trust through honest communication, transparency and ethical practices.',
    icon: FaHandshake,
  },
];


const STATS = [
  {
    value: '5+',
    label: 'Years Experience',
    icon: FaAward,
  },
  {
    value: '100+',
    label: 'Projects Completed',
    icon: FaBuilding,
  },
  {
    value: '50+',
    label: 'Skilled Professionals',
    icon: FaUsers,
  },
  {
    value: '98%',
    label: 'Client Satisfaction',
    icon: FaHandshake,
  },
  {
    value: '5+',
    label: 'Counties Served',
    icon: FaBuilding,
  },
];


function WhyChooseUs() {
  return (
    <div>


      <section className="relative h-[500px] overflow-hidden bg-[#071525]">

   
        <div className="absolute right-0 top-0 hidden h-full w-[48%] lg:block">

          <img
            src={buildingImage}
            alt=""
            className="h-full w-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/80 to-[#071525]/20" />

        </div>


        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          <div className="flex items-center gap-2 text-md text-gray-400">

            <Link
              to={PUBLIC_PATHS.HOME}
              className="transition-colors hover:text-[#f5b400]"
            >
              Home
            </Link>

            <span>›</span>

            <span className="text-white">
              Why Choose Us
            </span>

          </div>


          <div className="mt-6 max-w-2xl">

            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              Why Choose Us
            </h1>

            <div className="mt-5 h-1 w-12 bg-[#f5b400]" />

            <p className="mt-6 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              We combine experience, innovation and integrity to deliver
              construction solutions that stand the test of time.
            </p>

          </div>

        </div>

      </section>



      <section className="bg-white py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                Our Strengths
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#071525] sm:text-4xl">
                What Sets Us Apart
              </h2>


              <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">

                {REASONS.map((reason) => {

                  const Icon = reason.icon;

                  return (
                    <div
                      key={reason.title}
                      className="group flex gap-4"
                    >


                      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-[#f5b400]">

                        <Icon
                          className="text-2xl transition-transform duration-300 group-hover:scale-110"
                        />

                      </div>


                      <div>

                        <h3 className="text-sm font-bold text-[#071525]">
                          {reason.title}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                          {reason.body}
                        </p>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>



            <div className="relative overflow-hidden rounded-lg bg-gray-100">

              <img
                src={buildingImage}
                alt="Komaret construction project"
                className="h-[400px] w-full object-cover transition-transform duration-500 hover:scale-105"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-16">

                <p className="text-sm font-semibold text-white">
                  Building quality. Building trust.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="bg-[#071525] text-white">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 md:grid-cols-5">

            {STATS.map((stat) => {

              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="border-white/10 px-5 py-10 text-center md:border-r last:md:border-r-0"
                >

                  <Icon className="mx-auto text-2xl text-[#f5b400]" />

                  <p className="mt-4 text-3xl font-bold">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-300">
                    {stat.label}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>


      <section className="bg-white py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                Our Promise
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#071525] sm:text-4xl">
                Building Relationships That Last
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600">
                We don't just build structures; we build lasting relationships
                based on trust, reliability and outstanding results.
              </p>


              <div className="mt-7">

                <Link
                  to={PUBLIC_PATHS.QUOTE}
                  className="inline-flex items-center gap-3 bg-[#f5b400] px-6 py-3 text-sm font-semibold text-[#071525] transition-all duration-200 hover:bg-[#dca500]"
                >
                  Start Your Project

                </Link>

              </div>

            </div>


            <div className="overflow-hidden rounded-lg">

              <img
                src={Greeting}
                alt="Komaret building project"
                className="h-[300px] w-full object-cover transition-transform duration-500 hover:scale-105"
              />

            </div>

          </div>

        </div>

      </section>


    </div>
  );
}

export default WhyChooseUs;