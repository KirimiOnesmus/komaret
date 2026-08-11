import { NavLink, Outlet } from 'react-router-dom';
import useAuth from '../shared/hooks/useAuth';
import { ADMIN_PATHS, ADMIN_ROUTE_ROLES } from '../shared/constants/routes';

const NAV_ITEMS = [
  { label: 'Dashboard', to: ADMIN_PATHS.DASHBOARD },
  { label: 'Projects', to: ADMIN_PATHS.PROJECTS },
  { label: 'Machinery', to: ADMIN_PATHS.MACHINERY },
  { label: 'Labour', to: ADMIN_PATHS.LABOUR },
  { label: 'Interior Design', to: ADMIN_PATHS.INTERIOR_DESIGN },
  { label: 'Renovations', to: ADMIN_PATHS.RENOVATIONS },
  { label: 'Real Estate', to: ADMIN_PATHS.REAL_ESTATE },
  { label: 'Quotations', to: ADMIN_PATHS.QUOTATIONS },
  { label: 'CRM', to: ADMIN_PATHS.CRM },
  { label: 'Service Requests', to: ADMIN_PATHS.SERVICE_REQUESTS },
  { label: 'Communications', to: ADMIN_PATHS.COMMUNICATIONS },
  { label: 'Documents', to: ADMIN_PATHS.DOCUMENTS },
  { label: 'Reports', to: ADMIN_PATHS.REPORTS },
  { label: 'Settings', to: ADMIN_PATHS.SETTINGS },
];

function AdminSidebar() {
  const { hasRole } = useAuth();

  const visibleItems = NAV_ITEMS.filter((item) => {
    const requiredRoles = ADMIN_ROUTE_ROLES[item.to];
    if (!requiredRoles) return true;
    return requiredRoles.some((role) => hasRole(role));
  });

  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white md:block">
      <div className="flex h-16 items-center px-6 text-lg font-semibold text-gray-900">
        BuildCo Admin
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ADMIN_PATHS.DASHBOARD}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function AdminHeader() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-gray-600">{user.name || user.email}</span>}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
