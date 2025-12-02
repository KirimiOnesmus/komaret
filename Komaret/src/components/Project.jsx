import React, { useState } from "react";
import { 
  IoFilter,
  IoLocationOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoArrowForward,
  IoCheckmarkCircle,
  IoHome,
  IoBusiness,
  IoConstruct,
  IoClose
} from "react-icons/io5";

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: "all", label: "All Projects", icon: <IoConstruct size={20} /> },
    { id: "residential", label: "Residential", icon: <IoHome size={20} /> },
    { id: "commercial", label: "Commercial", icon: <IoBusiness size={20} /> },
    { id: "renovation", label: "Renovations", icon: <IoConstruct size={20} /> },
  ];

  const projects = [
    {
      id: 1,
      title: "Modern Villa in Karen",
      category: "residential",
      location: "Karen, Nairobi",
      year: "2024",
      budget: "KSh 35M - 40M",
      duration: "14 months",
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      description: "Luxury 5-bedroom villa with modern amenities, swimming pool, and landscaped gardens.",
      features: ["5 Bedrooms", "6 Bathrooms", "Swimming Pool", "Garden", "Solar System"],
      status: "Completed"
    },
    {
      id: 2,
      title: "Office Complex - Westlands",
      category: "commercial",
      location: "Westlands, Nairobi",
      year: "2023",
      budget: "KSh 120M - 150M",
      duration: "18 months",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      description: "5-story office building with modern facilities, parking, and eco-friendly features.",
      features: ["5 Floors", "50+ Offices", "Underground Parking", "Conference Rooms", "Green Building"],
      status: "Completed"
    },
    {
      id: 3,
      title: "Townhouse Development - Ruaka",
      category: "residential",
      location: "Ruaka, Kiambu",
      year: "2024",
      budget: "KSh 80M - 100M",
      duration: "20 months",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      description: "Gated community of 12 modern townhouses with shared amenities and security.",
      features: ["12 Units", "3 Bedrooms Each", "Clubhouse", "Playground", "24/7 Security"],
      status: "Completed"
    },
    {
      id: 4,
      title: "Restaurant Renovation - CBD",
      category: "renovation",
      location: "Nairobi CBD",
      year: "2023",
      budget: "KSh 8M - 10M",
      duration: "4 months",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
      description: "Complete renovation of upscale restaurant with modern kitchen and dining areas.",
      features: ["Full Interior Redesign", "Modern Kitchen", "New Plumbing", "Lighting System", "HVAC"],
      status: "Completed"
    },
    {
      id: 5,
      title: "Residential Apartments - Kilimani",
      category: "residential",
      location: "Kilimani, Nairobi",
      year: "2024",
      budget: "KSh 200M - 250M",
      duration: "24 months",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      description: "8-story apartment building with 48 units, rooftop terrace, and underground parking.",
      features: ["48 Apartments", "Rooftop Terrace", "Gym", "Underground Parking", "Elevator"],
      status: "In Progress"
    },
    {
      id: 6,
      title: "Warehouse Complex - Mlolongo",
      category: "commercial",
      location: "Mlolongo, Machakos",
      year: "2023",
      budget: "KSh 60M - 80M",
      duration: "12 months",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
      description: "Industrial warehouse facility with loading docks and office spaces.",
      features: ["5000 sqm Storage", "Loading Docks", "Office Block", "Security System", "Fire Safety"],
      status: "Completed"
    },
    {
      id: 7,
      title: "Hotel Renovation - Mombasa Road",
      category: "renovation",
      location: "Mombasa Road, Nairobi",
      year: "2024",
      budget: "KSh 25M - 30M",
      duration: "6 months",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      description: "Complete refurbishment of 40-room hotel including rooms, restaurant, and facilities.",
      features: ["40 Rooms", "Restaurant", "Conference Hall", "New Furniture", "Pool Upgrade"],
      status: "In Progress"
    },
    {
      id: 8,
      title: "Family Home - Runda",
      category: "residential",
      location: "Runda, Nairobi",
      year: "2023",
      budget: "KSh 28M - 32M",
      duration: "12 months",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      description: "Contemporary 4-bedroom home with spacious living areas and modern finishes.",
      features: ["4 Bedrooms", "DSQ", "Open Kitchen", "Garden", "Solar Backup"],
      status: "Completed"
    },
    {
      id: 9,
      title: "Shopping Center - Thika Road",
      category: "commercial",
      location: "Thika Road, Nairobi",
      year: "2024",
      budget: "KSh 180M - 220M",
      duration: "22 months",
      image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
      description: "Modern shopping mall with retail spaces, food court, and entertainment area.",
      features: ["50+ Retail Spaces", "Food Court", "Cinema", "Parking", "Modern Design"],
      status: "In Progress"
    }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-gray-900/95 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600')] bg-cover bg-center"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-yellow-400">Projects</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200">
            Showcasing excellence in construction across Kenya
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <IoFilter className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Filter Projects:</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeFilter === cat.id
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredProjects.length}</span> {activeFilter === "all" ? "total" : activeFilter} projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-yellow-400"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-semibold text-sm ${
                    project.status === "Completed" 
                      ? "bg-green-500 text-white" 
                      : "bg-yellow-400 text-gray-900"
                  }`}>
                    {project.status}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoLocationOutline className="text-blue-600" size={18} />
                      {project.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoCalendarOutline className="text-blue-600" size={18} />
                      {project.year} • {project.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <IoCashOutline className="text-blue-600" size={18} />
                      {project.budget}
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2">
                    View Details
                    <IoArrowForward />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-80">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
              >
                <IoClose size={24} />
              </button>
              <div className={`absolute bottom-4 right-4 px-6 py-3 rounded-full font-bold ${
                selectedProject.status === "Completed" 
                  ? "bg-green-500 text-white" 
                  : "bg-yellow-400 text-gray-900"
              }`}>
                {selectedProject.status}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedProject.title}
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {selectedProject.description}
              </p>

              {/* Project Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <IoLocationOutline size={24} />
                    <span className="font-semibold">Location</span>
                  </div>
                  <p className="text-gray-700">{selectedProject.location}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <IoCalendarOutline size={24} />
                    <span className="font-semibold">Timeline</span>
                  </div>
                  <p className="text-gray-700">{selectedProject.year}</p>
                  <p className="text-sm text-gray-600">{selectedProject.duration}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <IoCashOutline size={24} />
                    <span className="font-semibold">Budget Range</span>
                  </div>
                  <p className="text-gray-700">{selectedProject.budget}</p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <IoCheckmarkCircle className="text-green-500 flex-shrink-0" size={24} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 mb-4">
                  Interested in a similar project?
                </p>
                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                  Request a Quote for Your Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ProjectsPage;