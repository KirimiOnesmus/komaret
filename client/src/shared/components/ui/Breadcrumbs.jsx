import { Link } from 'react-router-dom';

function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="flex items-center gap-1.5">
            {idx > 0 && <span aria-hidden="true" className="text-gray-300">/</span>}
            {item.to ? (
              <Link to={item.to} className="font-medium transition-colors hover:text-[#071525]">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-600">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
