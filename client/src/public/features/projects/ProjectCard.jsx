import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';


function ProjectCard({ project }) {

  const status = project.status || 'Completed';

  const category =
    project.category ||
    project.type ||
    project.projectType ||
    'Construction';


  const statusClasses =
    status.toLowerCase() === 'ongoing'
      ? 'bg-emerald-500 text-white'
      : 'bg-[#f5b400] text-[#071525]';


  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">


      <div className="relative h-56 overflow-hidden bg-gray-100">

        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.title || 'Project'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
            No image available
          </div>
        )}



        <span
          className={`
            absolute bottom-3 left-3
            rounded-md px-3 py-1
            text-[11px] font-bold
            ${statusClasses}
          `}
        >
          {status}
        </span>

      </div>


 
      <div className="p-5">

        <h3 className="text-lg font-bold text-[#071525] transition-colors group-hover:text-[#f5b400]">
          {project.title}
        </h3>



        <p className="mt-1 text-xs font-medium text-blue-600">
          {category}
        </p>


   
        {project.location && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">

            <FaMapMarkerAlt className="shrink-0 text-[#f5b400]" />

            <span>
              {project.location}
            </span>

          </div>
        )}


        {project.description && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
            {project.description}
          </p>
        )}


        <Link
          to={`/projects/${encodeURIComponent(project.slug)}`}
          className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 transition-colors cursor-pointer hover:text-[#f5b400]"
        >
          View Project

          <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />

        </Link>

      </div>

    </article>
  );
}


export default ProjectCard;