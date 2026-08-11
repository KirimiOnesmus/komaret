import { useLocation, Link } from 'react-router-dom';
import { PUBLIC_PATHS } from '../../../shared/constants/routes';

function RequestConfirmation() {
  const location = useLocation();
  const reference = location.state?.reference;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Request received</h1>
      <p className="mt-4 text-gray-600">
        Thanks — our team will review your request and get back to you shortly.
      </p>
      {reference && (
        <p className="mt-2 text-sm text-gray-500">
          Reference: <span className="font-mono">{reference}</span>
        </p>
      )}
      <Link to={PUBLIC_PATHS.HOME} className="mt-8 inline-block text-sm font-medium text-blue-600 hover:underline">
        &larr; Back to home
      </Link>
    </div>
  );
}

export default RequestConfirmation;
 