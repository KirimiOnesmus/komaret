import React, { useState, useRef, useEffect } from "react";
import { IoMenu, IoClose, IoChevronDown } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use the current pathname as the active link
  const activeLink = location.pathname;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
    setServicesOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <div
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <span className="text-yellow-400 font-bold text-xl">K</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-700 group-hover:text-blue-600 transition-colors">
              Komaret
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => handleNavigation("/")}
              className={`font-semibold transition-all duration-200 ${
                activeLink === "/"
                  ? "text-blue-600 border-b-2 border-yellow-400 pb-1"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavigation("/about-us")}
              className={`font-semibold transition-all duration-200 ${
                activeLink === "/about-us"
                  ? "text-blue-600 border-b-2 border-yellow-400 pb-1"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              About Us
            </button>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1 font-semibold transition-all duration-200 ${
                  activeLink.startsWith("/services")
                    ? "text-blue-600 border-b-2 border-yellow-400 pb-1"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Services
                <IoChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    { label: "Building & Construction", path: "/services/construction" },
                    { label: "Renovations", path: "/services/renovations" },
                    { label: "Architectural Design", path: "/services/design" },
                    { label: "Project Management", path: "/services/management" },
                    { label: "Landscaping", path: "/services/landscaping" },
                    { label: "Equipment Rental", path: "/services/equipment" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`block w-full text-left px-5 py-3 transition-all duration-200 ${
                        activeLink === item.path
                          ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-yellow-400"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 border-l-4 border-transparent"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavigation("/projects")}
              className={`font-semibold transition-all duration-200 ${
                activeLink === "/projects"
                  ? "text-blue-600 border-b-2 border-yellow-400 pb-1"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              Projects
            </button>

            <button
              onClick={() => handleNavigation("/contact")}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              Get a Quote
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-200 mt-2 animate-in slide-in-from-top duration-300">
            <div className="flex flex-col gap-1 pt-4">
              <button
                onClick={() => handleNavigation("/")}
                className={`text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeLink === "/"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-yellow-400"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNavigation("/about-us")}
                className={`text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeLink === "/about-us"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-yellow-400"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                About Us
              </button>

              {/* Mobile Services */}
              <div>
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-between ${
                    activeLink.startsWith("/services")
                      ? "bg-blue-50 text-blue-700 border-l-4 border-yellow-400"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Services
                  <IoChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${
                      servicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {servicesOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {[
                      { label: "Building & Construction", path: "/services/construction" },
                      { label: "Renovations", path: "/services/renovations" },
                      { label: "Architectural Design", path: "/services/design" },
                      { label: "Project Management", path: "/services/management" },
                      { label: "Landscaping", path: "/services/landscaping" },
                      { label: "Equipment Rental", path: "/services/equipment" },
                    ].map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleNavigation(item.path)}
                        className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          activeLink === item.path
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleNavigation("/projects")}
                className={`text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                  activeLink === "/projects"
                    ? "bg-blue-50 text-blue-700 border-l-4 border-yellow-400"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Projects
              </button>

              <button
                onClick={() => handleNavigation("/contact")}
                className="mx-4 mt-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Get a Quote
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;