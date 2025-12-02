import React, { useState } from "react";
import { 
  IoCall,
  IoMail,
  IoLocationOutline,
  IoLogoWhatsapp,
  IoTime,
  IoCheckmarkCircle,
  IoSend,
  IoPersonOutline
} from "react-icons/io5";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    location: "",
    budget: "",
    timeline: "",
    message: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        location: "",
        budget: "",
        timeline: "",
        message: ""
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <IoCall size={28} />,
      title: "Phone",
      details: ["+254 XXX XXX XXX", "24/7 Emergency Line"],
      action: "tel:+254XXXXXXXXX"
    },
    {
      icon: <IoLogoWhatsapp size={28} />,
      title: "WhatsApp",
      details: ["+254 XXX XXX XXX", "Quick Response Guaranteed"],
      action: "https://wa.me/254XXXXXXXXX"
    },
    {
      icon: <IoMail size={28} />,
      title: "Email",
      details: ["info@komaret.com", "quotes@komaret.com"],
      action: "mailto:info@komaret.com"
    },
    {
      icon: <IoLocationOutline size={28} />,
      title: "Office Location",
      details: ["Mlolongo, Machakos County", "Kenya"],
      action: "https://maps.google.com"
    },
    {
      icon: <IoTime size={28} />,
      title: "Working Hours",
      details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 2:00 PM"],
      action: null
    }
  ];

  const services = [
    "Building & Construction",
    "Renovations",
    "Architectural Design",
    "Project Management",
    "Landscaping",
    "Equipment Rental"
  ];

  const budgetRanges = [
    "Under KSh 5M",
    "KSh 5M - 10M",
    "KSh 10M - 20M",
    "KSh 20M - 50M",
    "Above KSh 50M"
  ];

  const timelines = [
    "Within 1 month",
    "1-3 months",
    "3-6 months",
    "6-12 months",
    "Over 12 months"
  ];

  return (
    <div className="min-h-screen bg-white">

      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-gray-900/95 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600')] bg-cover bg-center"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get In <span className="text-yellow-400">Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Let's discuss your project and bring your vision to life
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            

            <div>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Request a <span className="text-blue-600">Free Quote</span>
                </h2>
                <p className="text-lg text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours with a detailed quotation.
                </p>
              </div>

              {formSubmitted ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IoCheckmarkCircle size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-700">
                    Your request has been submitted successfully. We'll contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
              
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <IoPersonOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <IoPersonOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

               
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <IoMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                          placeholder="john.doe@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <IoCall className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                          placeholder="+254 712 345 678"
                        />
                      </div>
                    </div>
                  </div>

               
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Required *
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Location *
                    </label>
                    <div className="relative">
                      <IoLocationOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                        placeholder="e.g., Karen, Nairobi"
                      />
                    </div>
                  </div>

                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Budget Range *
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range, index) => (
                          <option key={index} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Timeline *
                      </label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                      >
                        <option value="">Select timeline</option>
                        {timelines.map((time, index) => (
                          <option key={index} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors resize-none"
                      placeholder="Please provide details about your project requirements, specifications, or any questions you have..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <IoSend size={20} />
                    Submit Request
                  </button>
                </div>
              )}
            </div>

           
            <div className="space-y-8">
              {/* Google Maps Embed */}
              <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255284.14938876385!2d37.5!3d0.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17887f5e92f0e0e5%3A0x5e5e5e5e5e5e5e5e!2sGithongo%2C%20Meru%2C%20Kenya!5e0!3m2!1sen!2ske!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Komaret Office Location"
                ></iframe>
              </div>

              {/* Quick Contact Actions */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Connect With Us
                </h3>
                <p className="text-blue-100 mb-6">
                  Reach out through your preferred channel
                </p>
                <div className="flex justify-center gap-6">
                  <a
                    href="https://wa.me/254XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl"
                    title="WhatsApp"
                  >
                    <IoLogoWhatsapp size={32} />
                  </a>
                  
                  <a
                    href="tel:+254XXXXXXXXX"
                    className="w-16 h-16 bg-yellow-400 text-gray-900 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl"
                    title="Call Us"
                  >
                    <IoCall size={32} />
                  </a>
                  
                  <a
                    href="https://instagram.com/komaret"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-2xl"
                    title="Instagram"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;