import React from "react";
import { 
  IoCheckmarkCircle, 
  IoShieldCheckmark,
  IoRibbon,
  IoPeople,
  IoTrophy,
  IoConstruct,
  IoHammer,
  IoRocket,
  IoBulb,
  IoHeart,
  IoStar
} from "react-icons/io5";

const AboutPage = () => {
  const values = [
    {
      icon: <IoShieldCheckmark size={40} />,
      title: "Integrity",
      description: "We build trust through honest communication and transparent practices in every project we undertake."
    },
    {
      icon: <IoTrophy size={40} />,
      title: "Quality",
      description: "Excellence in craftsmanship and materials is our standard, never our exception."
    },
    {
      icon: <IoPeople size={40} />,
      title: "Safety",
      description: "We maintain the highest safety standards to protect our team, clients, and communities."
    },
    {
      icon: <IoBulb size={40} />,
      title: "Innovation",
      description: "We embrace modern construction techniques and sustainable building practices."
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "Certified Professionals" }
  ];

  const certifications = [
    "National Construction Authority (NCA) Licensed",
    "Engineers Board of Kenya (EBK) Registered",
    "NEMA Environmental Compliance",
    "ISO 9001:2015 Quality Management",
    "OSHA Safety Standards Certified",
    "Professional Indemnity Insurance"
  ];

  const whyChooseUs = [
    {
      icon: <IoConstruct size={32} />,
      title: "Experienced Team",
      description: "Our certified engineers and skilled craftsmen bring decades of combined expertise."
    },
    {
      icon: <IoRocket size={32} />,
      title: "Timely Delivery",
      description: "We respect your time and ensure projects are completed within agreed timelines."
    },
    {
      icon: <IoHammer size={32} />,
      title: "Quality Materials",
      description: "We source and use only premium, certified construction materials."
    },
    {
      icon: <IoHeart size={32} />,
      title: "Customer Care",
      description: "Dedicated support team available throughout and after project completion."
    },
    {
      icon: <IoBulb size={32} />,
      title: "Innovative Solutions",
      description: "Modern construction techniques and sustainable building practices."
    },
    {
      icon: <IoStar size={32} />,
      title: "Competitive Pricing",
      description: "Transparent pricing with no hidden costs - quality that fits your budget."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      

      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-gray-900/95 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600')] bg-cover bg-center"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-yellow-400">Komaret</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Building Kenya's future with precision, integrity, and excellence since 2023.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
    
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-blue-600">Story</span>
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  Founded in 2023, Komaret has grown from a small construction outfit to one of Kenya's most trusted building and construction companies. Our journey began with a simple mission: to deliver quality construction services with unwavering integrity.
                </p>
                <p>
                  Over the years, we've completed more than 500 projects across residential, commercial, and industrial sectors. From single-family homes to multi-story commercial buildings, our portfolio reflects our commitment to excellence and innovation.
                </p>
                <p>
                  Today, Komaret stands as a testament to what dedication, skilled craftsmanship, and client-focused service can achieve. We're proud to be building the spaces where Kenya lives, works, and thrives.
                </p>
              </div>
            </div>

        
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <IoRocket className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To deliver exceptional construction services that exceed client expectations through innovative solutions, quality craftsmanship, and unwavering commitment to safety and sustainability.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-yellow-400">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <IoBulb className="text-yellow-600" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To be East Africa's leading construction company, recognized for transforming communities through sustainable building practices and setting new standards in construction excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-blue-600">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every project we complete
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-yellow-400"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-4 text-yellow-400">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">Komaret?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine experience, expertise, and dedication to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Certifications & <span className="text-yellow-400">Licenses</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Fully licensed, certified, and insured for your peace of mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700"
              >
                <IoRibbon className="text-yellow-400 flex-shrink-0" size={32} />
                <span className="text-gray-200 font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default AboutPage;