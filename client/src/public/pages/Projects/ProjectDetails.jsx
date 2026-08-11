import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../../shared/components/common/Loading';
import publicService from '../../../shared/services/publicService';

function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    publicService
      .getProjectBySlug(slug)
      .then(({ data }) => {
        if (active) setProject(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load this project.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) return <Loading label="Loading project..." />;
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-red-600">{error}</p>;
  if (!project) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      {project.coverImageUrl && (
        <img src={project.coverImageUrl} alt="" className="mb-6 w-full rounded-lg object-cover" />
      )}
      <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
      {project.location && <p className="mt-1 text-sm text-gray-500">{project.location}</p>}
      {project.description && <p className="mt-4 text-gray-600">{project.description}</p>}
    </div> 
  );
}

export default ProjectDetails;
