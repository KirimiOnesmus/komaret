import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaDirections,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

import ContactForm from '../../features/contact/ContactForm';

import contactImage from '../../../assets/images/contact.jpg';

import { PUBLIC_PATHS } from '../../../shared/constants/routes';


const CONTACT_INFO = [
  {
    icon: FaMapMarkerAlt,
    title: 'Our Location',
    lines: [
      'Komaret Design & Construction Co.',
      'Meru, Kenya',
    ],
  },
  {
    icon: FaPhoneAlt,
    title: 'Call Us',
    lines: [
      '+254 700 123 456',
      '+254 712 987 654',
    ],
  },
  {
    icon: FaEnvelope,
    title: 'Email Us',
    lines: [
      'info@komaret.co.ke',
      'projects@komaret.co.ke',
    ],
  },
  {
    icon: FaClock,
    title: 'Working Hours',
    lines: [
      'Mon - Sat: 8:00 AM - 6:00 PM',
      'Sunday: Closed',
    ],
  },
];


function Contact() {
  return (
    <div className="bg-white">


      <section className="relative  h-[500px] overflow-hidden bg-[#071525]">

        <div className="absolute inset-0">
          <img
            src={contactImage}
            alt="Komaret Design & Construction"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#071525]/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/80 to-[#071525]/35" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

          <div className="flex items-center gap-2 text-md text-gray-300">

            <Link
              to={PUBLIC_PATHS.HOME}
              className="transition-colors hover:text-[#f5b400]"
            >
              Home
            </Link>

            <span>›</span>

            <span className="text-white">
              Contact Us
            </span>

          </div>


          <div className="mt-7 max-w-xl">

            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Contact Us
            </h1>

            <div className="mt-5 h-1 w-12 bg-[#f5b400]" />

            <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base">
              We are here to help you bring your ideas to life.
              Get in touch with our team today.
            </p>

          </div>

        </div>
      </section>



      <section className="py-14 sm:py-16">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">


          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
              Contact Us
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#071525] sm:text-3xl">
              Get In Touch
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Have a project in mind or need more information about our
              construction services? Our team is ready to assist you.
            </p>
          </div>


          <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">

            <div className="space-y-4">

              {CONTACT_INFO.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-md border border-gray-200 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >

                    <div className="flex gap-4">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f5b400]/10 text-[#f5b400]">
                        <Icon className="text-sm" />
                      </div>


                      {/* Content */}
                      <div className="min-w-0">

                        <h3 className="text-sm font-bold text-[#071525]">
                          {item.title}
                        </h3>

                        <div className="mt-2 space-y-1">

                          {item.lines.map((line) => (
                            <p
                              key={line}
                              className="text-xs leading-5 text-gray-500"
                            >
                              {line}
                            </p>
                          ))}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

            <div>

              <h3 className="text-sm font-bold text-[#071525]">
                Send Us a Message
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Fill in the form below and our team will get back to you
                as soon as possible.
              </p>

              <div className="mt-5">
                <ContactForm />
              </div>

            </div>

          </div>

        </div>

      </section>

      <section className="pb-14 sm:pb-16">

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
              Find Us
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#071525]">
              Our Location
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Visit us at our office or use the map below to find our
              exact location.
            </p>

          </div>


          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            <iframe
              title="Komaret Design & Construction location"
              src="https://www.google.com/maps?q=-0.0043328,37.5910742&z=15&output=embed"
              width="100%"
              height="420"
              style={{
                border: 0,
                display: 'block',
              }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />

          </div>


  
          <div className="mt-5 flex justify-end">

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=-0.0043328,37.5910742"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#f5b400] px-5 py-3 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#d99f00]"
            >
              <FaDirections />

              <span>
                Get Directions
              </span>

            </a>

          </div>

        </div>

      </section>




    </div>
  );
}


export default Contact;