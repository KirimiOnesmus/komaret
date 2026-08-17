import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useLayoutEffect } from "react";
import { PUBLIC_PATHS } from "../shared/constants/routes";
import useCategories from "../shared/hooks/useCategories";
import useScrollReveal from "../shared/hooks/useScrollReveal";
import logo from "../assets/images/logo.svg";
import Footer from "./features/home/Footer";

import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";


const MAX_DROPDOWN_CATEGORIES = 6;

const NAV_ITEMS = [
  { label: "Home", to: PUBLIC_PATHS.HOME },
  { label: "About Us", to: PUBLIC_PATHS.ABOUT },
  {
    label: "Services",
    to: PUBLIC_PATHS.SERVICES,
    dropdown: true,
  },
  { label: "Projects", to: PUBLIC_PATHS.PROJECTS },
  { label: "Why Choose Us", to: PUBLIC_PATHS.WHY_CHOOSE_US },
  { label: "News", to: PUBLIC_PATHS.NEWS },
  { label: "Contact Us", to: PUBLIC_PATHS.CONTACT },
];

function TopBar() {
  return (
    <div className="hidden bg-[#071525] text-white md:block">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 text-[11px]">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#f5b400]" />
            <span>Meru, Kenya</span>
          </div>

          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-[#f5b400]" />
            <span>+254 700 123 456</span>
          </div>

          <div className="flex items-center gap-2">
            <FaEnvelope className="text-[#f5b400]" />
            <span>info@komaret.co.ke</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <div className="flex items-center gap-2">
            <FaClock className="text-[#f5b400]" />
            <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="transition-colors hover:text-[#f5b400]"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="transition-colors hover:text-[#f5b400]"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="transition-colors hover:text-[#f5b400]"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesDropdown() {
  const { data: categories, loading } = useCategories();

  const visibleCategories = Array.isArray(categories)
    ? categories.slice(0, MAX_DROPDOWN_CATEGORIES)
    : [];

  const hasMore =
    Array.isArray(categories) && categories.length > MAX_DROPDOWN_CATEGORIES;

  return (
    <div className="invisible absolute left-0 top-full w-64 translate-y-2 rounded-sm border border-gray-100 bg-white py-2 opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <Link
        to={PUBLIC_PATHS.SERVICES}
        className="block px-5 py-3 text-sm font-semibold text-[#e9a900] transition-colors hover:bg-gray-50"
      >
        All Services
      </Link>

      <div className="my-1 border-t border-gray-100" />

      {loading && (
        <p className="px-5 py-3 text-sm text-gray-400">Loading...</p>
      )}

      {!loading && visibleCategories.length === 0 && (
        <p className="px-5 py-3 text-sm text-gray-400">
          No categories available yet.
        </p>
      )}

      {!loading &&
        visibleCategories.map((category) => (
          <Link
            key={category.slug}
            to={`${PUBLIC_PATHS.SERVICES}?category=${encodeURIComponent(category.slug)}`}
            className="block px-5 py-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#e9a900]"
          >
            {category.name}
          </Link>
        ))}

      {hasMore && (
        <Link
          to={PUBLIC_PATHS.SERVICES}
          className="block px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#e9a900]"
        >
          View all services
        </Link>
      )}
    </div>
  );
}

function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <TopBar />

      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to={PUBLIC_PATHS.HOME} className="flex shrink-0 items-center">
            <img
              src={logo}
              alt="Komaret Design & Construction Co."
              className="h-[64px] w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => (
              <div key={item.to} className="group relative">
                <NavLink
                  to={item.to}
                  end={item.to === PUBLIC_PATHS.HOME}
                  className={({ isActive }) =>
                    `
                    relative flex items-center gap-1
                    py-7 text-[13px] font-medium
                    transition-colors duration-200
                    ${
                      isActive
                        ? "text-[#e9a900]"
                        : "text-gray-700 hover:text-[#e9a900]"
                    }
                    `
                  }
                >
                  {item.label}

                  {item.dropdown && (
                    <FaChevronDown className="ml-1 text-[9px]" />
                  )}
                </NavLink>

                {item.dropdown && <ServicesDropdown />}
              </div>
            ))}
          </nav>

          <Link
            to={PUBLIC_PATHS.QUOTE}
            className="hidden bg-[#f5b400] px-6 py-3 text-[13px] font-semibold text-[#071525] transition-colors hover:bg-[#e2a800] lg:block"
          >
            Get a Quote
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-b border-gray-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === PUBLIC_PATHS.HOME}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    border-b border-gray-100 px-2 py-3
                    text-sm font-medium
                    ${
                      isActive
                        ? "text-[#e9a900]"
                        : "text-gray-700 hover:text-[#e9a900]"
                    }
                    `
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              <Link
                to={PUBLIC_PATHS.QUOTE}
                onClick={() => setMobileOpen(false)}
                className="mt-4 bg-[#f5b400] px-5 py-3 text-center text-sm font-semibold text-[#071525]"
              >
                Get a Quote
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <Footer />
    </footer>
  );
}

function PublicLayout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useScrollReveal();

  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}

export default PublicLayout;
