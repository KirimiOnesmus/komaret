import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaMapMarkerAlt,
} from 'react-icons/fa';

import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import publicService from '../../../shared/services/publicService';
import ProjectCard from '../../features/projects/ProjectCard';
import extractList from '../../../shared/utils/api';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';

import projectsHero from '../../../assets/images/projects.jpg';


const ALL = 'All Projects';


function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFilter, setActiveFilter] = useState(ALL);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const PROJECTS_PER_PAGE = 6;


  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        const { data } = await publicService.getProjects();

        if (active) {
          setProjects(extractList(data));
        }
      } catch (err) {
        if (active) {
          setError(
            err.message || 'Unable to load projects right now.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      active = false;
    };
  }, []);



  const FILTERS = useMemo(() => {
    const names = new Set();
    projects.forEach((p) => {
      if (p.service?.name) names.add(p.service.name);
    });
    return [ALL, ...Array.from(names).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (activeFilter !== ALL) {
      result = result.filter(
        (project) => (project.service?.name || '').toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((project) => {
        return (
          project.name?.toLowerCase().includes(query) ||
          project.location?.toLowerCase().includes(query) ||
          project.summary?.toLowerCase().includes(query) ||
          project.description?.toLowerCase().includes(query) ||
          project.service?.name?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [projects, activeFilter, search]);


  const totalPages = Math.ceil(
    filteredProjects.length / PROJECTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * PROJECTS_PER_PAGE;

  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + PROJECTS_PER_PAGE
  );


  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };


  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };


  return (
    <div className="bg-white">


      <section className="relative h-[500px]  overflow-hidden bg-[#071525]">

        <div className="absolute inset-0">

          <img
            src={projectsHero}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[#071525]/80" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#071525] via-[#071525]/80 to-[#071525]/40" />

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
              Projects
            </span>

          </div>


          <div className="mt-7 max-w-2xl">

            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Our Projects
            </h1>

            <div className="mt-5 h-1 w-12 bg-[#f5b400]" />

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300 sm:text-base">
              Explore a selection of our completed and ongoing
              projects across various sectors.
            </p>

          </div>

        </div>

      </section>



      <section className="py-14 sm:py-16">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

   
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

  
            <div className="flex flex-wrap gap-2">

              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => handleFilterChange(filter)}
                  className={`
                    rounded-md border px-4 py-2 text-xs font-medium
                    transition-all duration-200 cursor-pointer
                    ${
                      activeFilter === filter
                        ? 'border-[#f5b400] bg-[#f5b400] text-[#071525]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#f5b400] hover:text-[#071525]'
                    }
                  `}
                >
                  {filter}
                </button>
              ))}

            </div>


 
            <div className="relative w-full lg:w-64">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search projects..."
                className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#f5b400] focus:ring-1 focus:ring-[#f5b400]"
              />

            </div>

          </div>


     
          {loading && (
            <div className="py-16">
              <Loading label="Loading projects..." />
            </div>
          )}


         
          {error && (
            <div className="mt-8 rounded-md border border-red-100 bg-red-50 p-5 text-sm text-red-600">
              {error}
            </div>
          )}



          {!loading &&
            !error &&
            filteredProjects.length === 0 && (
              <div className="py-16">
                <EmptyState title="No projects found" />
              </div>
            )}


                {!loading &&
            !error &&
            paginatedProjects.length > 0 && (

              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {paginatedProjects.map((project) => (
                  <ProjectCard
                    key={project.slug}
                    project={project}
                  />
                ))}

              </div>

            )}


   
          {!loading &&
            !error &&
            filteredProjects.length > PROJECTS_PER_PAGE && (

              <div className="mt-12 flex items-center justify-center gap-2">

          
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-sm text-gray-600 
                  transition hover:border-[#f5b400] hover:text-[#071525] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <FaChevronLeft className="text-xs" />
                </button>


             
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (

                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`
                      flex h-9 min-w-9 items-center justify-center
                      rounded-md border px-3 text-sm font-medium
                      transition cursor-pointer
                      ${
                        currentPage === page
                          ? 'border-[#f5b400] bg-[#f5b400] text-[#071525]'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-[#f5b400]'
                      }
                    `}
                  >
                    {page}
                  </button>

                ))}


         
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-sm cursor-pointer
                   text-gray-600 transition hover:border-[#f5b400] hover:text-[#071525] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaChevronRight className="text-xs" />
                </button>

              </div>

            )}

        </div>

      </section>

    </div>
  );
}


export default Projects;