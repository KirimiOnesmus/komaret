import { useParams, Link } from 'react-router-dom';
import Loading from '../../../shared/components/common/Loading';
import Button from '../../../shared/components/common/Button';
import useServices from '../../../shared/hooks/useServices';

function ServiceDetails() {
  const { slug } = useParams();
  const { data: service, loading, error } = useServices({ slug });

  if (loading) return <Loading label="Loading service..." />;
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-red-600">{error}</p>;
  if (!service) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
      {service.description && <p className="mt-4 text-gray-600">{service.description}</p>}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link to={`/services/${encodeURIComponent(slug)}/request`}>
          <Button>Request this service</Button>
        </Link>
        <Link to={`/services/${encodeURIComponent(slug)}/estimate`}>
          <Button variant="secondary">Get an instant estimate</Button>
        </Link>
      </div>
    </div>
  );
}

export default ServiceDetails;
 