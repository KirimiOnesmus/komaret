import { NavLink, Outlet } from 'react-router-dom';
import { FaLayerGroup, FaTruck, FaUsersCog } from 'react-icons/fa';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const TABS = [
  { label: 'All Services', to: ADMIN_PATHS.SERVICES, icon: FaLayerGroup, end: true },
  { label: 'Machinery', to: ADMIN_PATHS.MACHINERY, icon: FaTruck, end: false },
  { label: 'Labour', to: ADMIN_PATHS.LABOUR, icon: FaUsersCog, end: false },
];

function ServicesLayout() {
  return (
    <div>
      <div className="border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto">
          {TABS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-[#f5b400] text-[#071525]'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-[#071525]'
                }`
              }
            >
              <Icon className="text-xs" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default ServicesLayout;