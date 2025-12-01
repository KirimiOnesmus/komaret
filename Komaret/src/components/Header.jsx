import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const active = location.pathname;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="flex justify-between items-center px-4 py-5 bg-white/70 backdrop-blur-md border-b border-gray-200 font-semibold text-lg relative z-50">
    
      <h1
        onClick={() => handleNavigation("/")}
        className="text-2xl cursor-pointer text-blue-600 font-bold hover:scale-105 transition-transform"
      >
        Komaret
      </h1>

  
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-3xl text-gray-700 hover:text-blue-500 transition"
      >
        <IoMenu />
      </button>

      <nav
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out transform md:transform-none ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 md:opacity-100 md:translate-y-0 hidden md:block"
        }`}
      >
        <ul className="flex flex-col md:flex-row md:items-center md:gap-6 px-4 md:px-0 py-4 md:py-0">
          <li>
            <button
              onClick={() => handleNavigation("/")}
              className={`cursor-pointer transition-colors duration-200 ${
                active === "/"
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            >
              Home
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/about")}
              className={`cursor-pointer transition-colors duration-200 ${
                active === "/about"
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            >
              About Us
            </button>
          </li>

          {/* Services Dropdown */}
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`cursor-pointer transition-colors duration-200 ${
                active.startsWith("/services")
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            >
              Services
            </button>

            <ul
              className={`absolute left-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out origin-top ${
                servicesOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {[
                { label: "Designs", path: "/services/designs" },
                { label: "House Construction", path: "/services/construction" },
                {
                  label: "Project Management",
                  path: "/services/project-management",
                },
                {
                  label: "Machine Rental Services",
                  path: "/services/rental-services",
                },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 hover:font-semibold transition-colors duration-200 ${
                      active === item.path ? "bg-blue-50 font-semibold" : ""
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/projects")}
              className={`cursor-pointer transition-colors duration-200 ${
                active === "/projects"
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            >
              Projects
            </button>
          </li>

          <li>
            <button
              onClick={() => handleNavigation("/contact")}
              className={`cursor-pointer transition-colors duration-200 ${
                active === "/contact"
                  ? "text-blue-600"
                  : "text-gray-800 hover:text-blue-500"
              }`}
            >
              Contact Us
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
