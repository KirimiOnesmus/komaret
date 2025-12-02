import React, { useState } from "react";
import { 
  IoCheckmarkCircle, 
  IoConstruct, 
  IoHome, 
  IoBusiness,
  IoHammer,
  IoColorPalette,
  IoRocket,
  IoArrowForward,
  IoCall,
  IoLogoWhatsapp
} from "react-icons/io5";

const Homepage = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      icon: <IoConstruct size={40} />,
      title: "Building & Construction",
      description: "Complete building solutions from foundation to finishing with quality craftsmanship."
    },
    {
      icon: <IoHammer size={40} />,
      title: "Renovations",
      description: "Transform your existing spaces with our expert renovation and remodeling services."
    },
    {
      icon: <IoColorPalette size={40} />,
      title: "Architectural Design",
      description: "Creative and functional designs that bring your vision to life."
    },
    {
      icon: <IoRocket size={40} />,
      title: "Project Management",
      description: "End-to-end project coordination ensuring timely delivery and quality standards."
    },
    {
      icon: <IoHome size={40} />,
      title: "Landscaping",
      description: "Beautiful outdoor spaces that complement your property perfectly."
    },
    {
      icon: <IoBusiness size={40} />,
      title: "Equipment Rental",
      description: "High-quality construction equipment available for your project needs."
    }
  ];

  const processSteps = [
    { step: "01", title: "Consultation", description: "Initial discussion of your project requirements and vision" },
    { step: "02", title: "Site Visit", description: "Professional site assessment and measurements" },
    { step: "03", title: "Quotation", description: "Detailed cost breakdown and timeline proposal" },
    { step: "04", title: "Design & Planning", description: "Architectural plans and permit processing" },
    { step: "05", title: "Construction", description: "Quality execution by certified professionals" },
    { step: "06", title: "Handover", description: "Final inspection and project completion" }
  ];

  const whyChooseUs = [
    "Certified & Licensed Engineers",
    "Quality Materials & Workmanship",
    "On-Time Project Delivery",
    "Competitive Pricing",
    "Safety Standards Compliance",
    "After-Sales Support"
  ];

  return (
    <div className="min-h-screen bg-white">
      
  
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-gray-900/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600')] bg-cover bg-center"></div>
        
    
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Building With <span className="text-yellow-400">Precision</span>
            <br />& <span className="text-yellow-400">Integrity</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Your trusted partner for quality construction, renovation, and project management services in Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              Get a Quote <IoArrowForward />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
              View Projects <IoArrowForward />
            </button>
          </div>
        </div>
      </section>

    
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive construction solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveService(index)}
                onMouseLeave={() => setActiveService(null)}
                className={`p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 ${
                  activeService === index ? 'border-yellow-400' : 'border-transparent'
                }`}
              >
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
                  activeService === index 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-yellow-400' 
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose <span className="text-blue-600">Komaret?</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We combine experience, expertise, and dedication to deliver exceptional results that exceed expectations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <IoCheckmarkCircle className="text-yellow-400 flex-shrink-0 mt-1" size={24} />
                    <span className="text-gray-700 font-medium">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800" 
                  alt="Construction team"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-yellow-400">Process</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A streamlined approach from concept to completion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 h-full">
                  <div className="text-6xl font-bold text-yellow-400/20 mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Your Free Quote Today
            </h2>
            <p className="text-xl text-blue-100">
              Fill out the form below and our team will get back to you within 24 hours
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <form className="space-y-6">
                
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                      placeholder="Brian Koome"
                    />
                  </div>
                

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="briankoome@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                    placeholder="+254 712 345 678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Service Interested In *
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors">
                    <option value="">Select a service</option>
                    <option value="construction">Building & Construction</option>
                    <option value="renovation">Renovations</option>
                    <option value="design">Architectural Design</option>
                    <option value="management">Project Management</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="equipment">Equipment Rental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    required
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                >
                  Submit Request
                </button>
              </form>
            </div>

            {/* Contact Info & Quick Links */}
            <div className="space-y-6">
              {/* Contact Information Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IoCall size={24} className="text-gray-900" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Phone</p>
                      <p className="text-blue-100">+254 XXX XXX XXX</p>
                      <p className="text-blue-100">Available 24/7</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IoLogoWhatsapp size={24} className="text-gray-900" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">WhatsApp</p>
                      <p className="text-blue-100">Quick response guaranteed</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 text-white">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IoHome size={24} className="text-gray-900" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Office</p>
                      <p className="text-blue-100">Githongo, Meru County</p>
                      <p className="text-blue-100">Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Choose Us Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Why Choose Komaret?</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-yellow-400 flex-shrink-0" size={24} />
                    <span>Free site visit & consultation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-yellow-400 flex-shrink-0" size={24} />
                    <span>Detailed quotation within 48 hours</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-yellow-400 flex-shrink-0" size={24} />
                    <span>Licensed & certified professionals</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <IoCheckmarkCircle className="text-yellow-400 flex-shrink-0" size={24} />
                    <span>Quality materials & workmanship</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;