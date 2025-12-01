import React from "react";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoLogoWhatsapp,
  IoArrowForward,
} from "react-icons/io5";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  const services = [
    { name: "Building & Construction", path: "/services/construction" },
    { name: "Renovations", path: "/services/renovations" },
    { name: "Architectural Design", path: "/services/design" },
    { name: "Project Management", path: "/services/management" },
    { name: "Landscaping", path: "/services/landscaping" },
    { name: "Equipment Rental", path: "/services/equipment" },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-yellow-400 font-bold text-xl">K</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Komaret</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Building with precision and integrity. Your trusted partner for
              quality construction, renovation, and project management services.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 bg-gray-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <IoLogoFacebook size={20} />
              </a>
     
              <a
                href="#"
                className="w-9 h-9 bg-gray-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <IoLogoInstagram size={20} />
              </a>
  
              <a
                href="#"
                className="w-9 h-9 bg-gray-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <IoLogoWhatsapp size={20} />
              </a>
            </div>
          </div>


          <div>
            <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-yellow-400 pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 hover:translate-x-1 transition-all duration-200 group"
                  >
                    <IoArrowForward
                      size={14}
                      className="group-hover:text-yellow-400"
                    />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-yellow-400 pl-3">
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((service) => (
                <li key={service.path}>
                  <a
                    href={service.path}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 hover:translate-x-1 transition-all duration-200 group"
                  >
                    <IoArrowForward
                      size={14}
                      className="group-hover:text-yellow-400"
                    />
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-yellow-400 pl-3">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <IoLocationOutline
                  size={22}
                  className="text-yellow-400 flex-shrink-0 mt-1"
                />
                <span>
                  Githongo, Meru County
                  <br />
                  Kenya
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer">
                <IoCallOutline
                  size={22}
                  className="text-yellow-400 flex-shrink-0"
                />
                <span>+254 729 643 877</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer">
                <IoMailOutline
                  size={22}
                  className="text-yellow-400 flex-shrink-0"
                />
                <span>info@komaret.com</span>
              </li>
            </ul>

        
            <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105">
              Get Free Quote
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {currentYear}{" "}
              <span className="text-white font-semibold">Komaret</span>. All
              rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="/privacy"
                className="hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>

          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Company Registration No: [To be provided] | Licensed & Insured
            </p>
          </div>
                  <div className="mt-3 text-center text-xs text-gray-500">
            <p>
              Designed by{' '}
              <span className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
                Onesmus Kirimi
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
