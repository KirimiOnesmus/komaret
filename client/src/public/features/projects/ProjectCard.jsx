import { Link } from 'react-router-dom';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { mediaUrl } from '../../../shared/utils/mediaUrl';

function coverOf(project) {
  const imgs = project.images || [];
  const cover = imgs.find((i) => i.isCover) || imgs[0];
  return cover ? mediaUrl(cover.path) : null;
}

function ProjectCard({ project }) {
  if (!project) return null;

  const image = coverOf(project);
  const category = project.service?.name || 'Construction';
  const blurb = project.summary || project.description;

  return (
    <article className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={project.name || 'Project'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
            No image available
          </div>
        )}

        <span className="absolute bottom-3 left-3 rounded-md bg-[#f5b400] px-3 py-1 text-[11px] font-bold text-[#071525]">
          Completed
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-[#071525] transition-colors group-hover:text-[#f5b400]">
          {project.name}
        </h3>

        <p className="mt-1 text-xs font-medium text-blue-600">{category}</p>

        {project.location && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <FaMapMarkerAlt className="shrink-0 text-[#f5b400]" />
            <span>{project.location}</span>
          </div>
        )}

        {blurb && (
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">{blurb}</p>
        )}

        <Link
          to={`/projects/${encodeURIComponent(project.id)}`}
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
