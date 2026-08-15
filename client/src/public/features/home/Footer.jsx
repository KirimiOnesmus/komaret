import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

import logo from '../../../assets/images/logo-dark.svg';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';
import useCategories from '../../../shared/hooks/useCategories';

const FOOTER_CATEGORY_LIMIT = 6;

const Footer = () => {
  const year = new Date().getFullYear();
  const { data: categories, loading: categoriesLoading } = useCategories();

  const footerCategories = Array.isArray(categories)
    ? categories.slice(0, FOOTER_CATEGORY_LIMIT)
    : [];

  return (
    <footer className="bg-[#071525] text-white">



      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          <div>

            <Link
              to={PUBLIC_PATHS.HOME}
              className="inline-block"
            >
              <img
                src={logo}
                alt="Komaret Design & Construction Co."
                className="h-16 w-auto object-contain"
              />
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
              Building quality spaces, delivering reliable construction
              and infrastructure solutions, and turning your vision
              into lasting value.
            </p>

            <div className="mt-6 flex items-center gap-2">

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 text-gray-300 transition-all hover:border-[#f5b400] hover:bg-[#f5b400] hover:text-[#071525]"
              >
                <FaFacebookF className="text-xs" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 text-gray-300 transition-all hover:border-[#f5b400] hover:bg-[#f5b400] hover:text-[#071525]"
              >
                <FaInstagram className="text-xs" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 text-gray-300 transition-all hover:border-[#f5b400] hover:bg-[#f5b400] hover:text-[#071525]"
              >
                <FaLinkedinIn className="text-xs" />
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-600 text-gray-300 transition-all hover:border-[#f5b400] hover:bg-[#f5b400] hover:text-[#071525]"
              >
                <FaWhatsapp className="text-sm" />
              </a>

            </div>

          </div>



          <div>

            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <Link
                  to={PUBLIC_PATHS.HOME}
                  className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to={PUBLIC_PATHS.ABOUT}
                  className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to={PUBLIC_PATHS.SERVICES}
                  className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                >
                  Services
                </Link>
              </li>

              <li>
                <Link
                  to={PUBLIC_PATHS.PROJECTS}
                  className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                >
                  Projects
                </Link>
              </li>

              <li>
                <Link
                  to={PUBLIC_PATHS.WHY_CHOOSE_US}
                  className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                >
                  Why Choose Us
                </Link>
              </li>

              <li>
                <Link
                  to={PUBLIC_PATHS.NEWS}
                  className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                >
                  News
                </Link>
              </li>

              <li>
                <Link
                  to={PUBLIC_PATHS.CONTACT}
                  className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                >
                  Contact Us
                </Link>
              </li>

            </ul>

          </div>



          <div>

            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Our Services
            </h3>

            <ul className="mt-5 space-y-3">

              {categoriesLoading && (
                <li className="text-sm text-gray-500">Loading...</li>
              )}

              {!categoriesLoading && footerCategories.length === 0 && (
                <li>
                  <Link
                    to={PUBLIC_PATHS.SERVICES}
                    className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                  >
                    View all services
                  </Link>
                </li>
              )}

              {!categoriesLoading &&
                footerCategories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`${PUBLIC_PATHS.SERVICES}?category=${encodeURIComponent(category.slug)}`}
                      className="text-sm text-gray-400 transition-colors hover:text-[#f5b400]"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}

            </ul>

          </div>



          <div>

            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">

                <FaMapMarkerAlt className="mt-1 shrink-0 text-[#f5b400]" />

                <p className="text-sm leading-5 text-gray-400">
                  Meru, Kenya
                </p>

              </div>


              <div className="flex items-center gap-3">

                <FaPhoneAlt className="shrink-0 text-[#f5b400]" />

                <a
                  href="tel:+254700123456"
                  className="text-sm text-gray-400 hover:text-[#f5b400]"
                >
                  +254 700 123 456
                </a>

              </div>


              <div className="flex items-center gap-3">

                <FaEnvelope className="shrink-0 text-[#f5b400]" />

                <a
                  href="mailto:info@komaret.co.ke"
                  className="break-all text-sm text-gray-400 hover:text-[#f5b400]"
                >
                  info@komaret.co.ke
                </a>

              </div>


              <div className="flex items-start gap-3">

                <FaClock className="mt-1 shrink-0 text-[#f5b400]" />

                <p className="text-sm leading-5 text-gray-400">
                  Mon - Sat
                  <br />
                  8:00 AM - 6:00 PM
                </p>

              </div>

            </div>

          </div>


        </div>

      </div>


  
      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-gray-500 sm:px-6 md:flex-row lg:px-8">

          <p>
            © {year} Komaret Design & Construction Co.
            All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <Link
              to="#"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="#"
              className="transition-colors hover:text-white"
            >
              Terms of Use
            </Link>

          </div>

          <p>
            Designed & Developed by Onesmus Kirimi
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;