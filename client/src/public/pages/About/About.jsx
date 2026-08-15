import {
  FaShieldAlt,
  FaEye,
  FaGem,
  FaUsers,
  FaCheckCircle,
  FaBuilding,
  FaHandshake,
  FaAward,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { PUBLIC_PATHS } from '../../../shared/constants/routes';

import aboutImage from '../../../assets/images/about.jpg';

function About() {
  return (
    <div>

      <section className="relative h-[500px] overflow-hidden bg-[#071525]">

        <img
          src={aboutImage}
          alt="Komaret construction projects"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#071525]/80" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#071525]/95 via-[#071525]/75 to-[#071525]/40" />


        <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">

          <div className="max-w-2xl">


            <div className="mb-5 flex items-center gap-2 text-md text-gray-300">

              <Link
                to={PUBLIC_PATHS.HOME}
                className="hover:text-[#f5b400]"
              >
                Home
              </Link>

              <span>›</span>

              <span className="text-white">
                About Us
              </span>

            </div>


            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              About Us
            </h1>


            <div className="mt-4 h-1 w-12 bg-[#f5b400]" />


            <p className="mt-5 text-md font-semibold text-white sm:text-base">
              Building spaces. Building trust.
            </p>

            <p className="mt-2 max-w-xl text-md leading-6 text-gray-300">
              We are a leading construction and property company dedicated
              to delivering quality projects on time, within budget and
              beyond expectations.
            </p>

          </div>

        </div>

      </section>


      <section className="bg-white py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">


            <div className="overflow-hidden rounded-lg">

              <img
                src={aboutImage}
                alt="Komaret construction project"
                className="h-[360px] w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-[420px]"
              />

            </div>


            <div>

              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
                Our Story
              </p>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#071525] sm:text-4xl">
                Building a Better Tomorrow
              </h2>

              <p className="mt-6 text-sm leading-7 text-gray-600">
                Founded with a vision to deliver dependable construction
                and property solutions, Komaret Design & Construction Co.
                is committed to becoming a trusted partner for clients
                across residential, commercial and infrastructure projects.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                Our commitment to quality, innovation and integrity drives
                everything we do. We combine modern technology, skilled
                professionals and sustainable practices to deliver spaces
                that inspire and stand the test of time.
              </p>

              <div className="mt-7">

                <Link
                  to={PUBLIC_PATHS.SERVICES}
                  className="inline-flex items-center gap-3 bg-[#f5b400] px-6 py-3 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#dca500]"
                >
                  Work With Us
                  <span></span>
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>


      <section className="bg-white pb-16 sm:pb-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">



            <div className="group">

              <div className="mb-5 flex h-12 w-12 items-center justify-center text-[#f5b400]">
                <FaShieldAlt className="text-4xl transition-transform duration-300 group-hover:scale-110" />
              </div>

              <h3 className="text-base font-bold text-[#071525]">
                Our Mission
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                To deliver world-class construction and infrastructure
                solutions that create lasting value for our clients
                and communities.
              </p>

            </div>



            <div className="group">

              <div className="mb-5 flex h-12 w-12 items-center justify-center text-[#f5b400]">
                <FaEye className="text-4xl transition-transform duration-300 group-hover:scale-110" />
              </div>

              <h3 className="text-base font-bold text-[#071525]">
                Our Vision
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                To be the most trusted and preferred construction partner
                in Kenya and beyond.
              </p>

            </div>



            <div className="group">

              <div className="mb-5 flex h-12 w-12 items-center justify-center text-[#f5b400]">
                <FaGem className="text-4xl transition-transform duration-300 group-hover:scale-110" />
              </div>

              <h3 className="text-base font-bold text-[#071525]">
                Our Values
              </h3>

              <ul className="mt-3 space-y-1.5 text-sm text-gray-600">

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Integrity
                </li>

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Quality
                </li>

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Innovation
                </li>

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Safety
                </li>

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Teamwork
                </li>

              </ul>

            </div>



            <div className="group">

              <div className="mb-5 flex h-12 w-12 items-center justify-center text-[#f5b400]">
                <FaUsers className="text-4xl transition-transform duration-300 group-hover:scale-110" />
              </div>

              <h3 className="text-base font-bold text-[#071525]">
                Our Commitments
              </h3>

              <ul className="mt-3 space-y-1.5 text-sm text-gray-600">

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  On-time delivery
                </li>

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Client satisfaction
                </li>

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Sustainable practices
                </li>

                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-[10px] text-[#f5b400]" />
                  Continuous improvement
                </li>

              </ul>

            </div>

          </div>

        </div>

      </section>


      <section className="relative overflow-hidden bg-[#071525] text-white">

        <div className="absolute inset-0 bg-[#071525]/90" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
            Our Impact in Numbers
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Numbers That Define Us
          </h2>


          <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-5">


   
            <div>
              <FaAward className="text-3xl text-[#f5b400]" />

              <p className="mt-4 text-3xl font-bold">
                5+
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Years Experience
              </p>
            </div>


    
            <div>
              <FaBuilding className="text-3xl text-[#f5b400]" />

              <p className="mt-4 text-3xl font-bold">
                50+
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Projects Completed
              </p>
            </div>


  
            <div>
              <FaUsers className="text-3xl text-[#f5b400]" />

              <p className="mt-4 text-3xl font-bold">
                50+
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Skilled Professionals
              </p>
            </div>


          
            <div>
              <FaHandshake className="text-3xl text-[#f5b400]" />

              <p className="mt-4 text-3xl font-bold">
                98%
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Client Satisfaction
              </p>
            </div>


      
            <div>
              <FaBuilding className="text-3xl text-[#f5b400]" />

              <p className="mt-4 text-3xl font-bold">
                5+
              </p>

              <p className="mt-1 text-sm text-gray-300">
                Counties Served
              </p>
            </div>

          </div>

        </div>

      </section>



      <section className="bg-white py-20 sm:py-24">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
            Meet Our Team
          </p>

          <h2 className="mt-3 text-3xl font-bold text-[#071525] sm:text-4xl">
            The People Behind Our Success
          </h2>



          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                name: 'Team Member',
                role: 'Managing Director',
              },
              {
                name: 'Team Member',
                role: 'Project Manager',
              },
              {
                name: 'Team Member',
                role: 'Lead Architect',
              },
              {
                name: 'Team Member',
                role: 'Construction Manager',
              },
            ].map((member) => (

              <div
                key={`${member.name}-${member.role}`}
                className="overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
              >
    <div className="flex h-64 items-center justify-center bg-gray-200">

                  <FaUsers className="text-6xl text-gray-400" />

                </div>

                <div className="p-5">

                  <h3 className="font-bold text-[#071525]">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {member.role}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}

export default About;