import { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  FaThLarge,
  FaHardHat,
  FaLayerGroup,
  FaTruck,
  FaUsersCog,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaAddressBook,
  FaComments,
  FaMoneyBillWaveAlt ,
  FaChartBar,
  FaCog,
  FaPlus,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from 'react-icons/fa';

import useAuth from '../shared/hooks/useAuth';
import { ADMIN_PATHS, ADMIN_ROUTE_ROLES } from '../shared/constants/routes';
import logo from "../assets/images/logo.svg"

const NAV_GROUPS = [
  {
    heading: null,
    items: [
      { label: 'Dashboard', to: ADMIN_PATHS.DASHBOARD, icon: FaThLarge, end: true },
      { label: 'Projects', to: ADMIN_PATHS.PROJECTS, icon: FaHardHat },
      { label: 'Services', to: ADMIN_PATHS.SERVICES, icon: FaLayerGroup, end: true },
      { label: 'Machinery', to: ADMIN_PATHS.MACHINERY, icon: FaTruck },
      { label: 'Labour', to: ADMIN_PATHS.LABOUR, icon: FaUsersCog },
      { label: 'Quotations', to: ADMIN_PATHS.QUOTATIONS, icon: FaFileInvoiceDollar },
      { label: 'Service Requests', to: ADMIN_PATHS.SERVICE_REQUESTS, icon: FaClipboardList },
      { label: 'CRM', to: ADMIN_PATHS.CRM, icon: FaAddressBook },
    ],
  },
  {
    heading: 'Operations',
    items: [
      { label: 'Communications', to: ADMIN_PATHS.COMMUNICATIONS, icon: FaComments },
      { label: 'Payments', to: ADMIN_PATHS.PAYMENT, icon: FaMoneyBillWaveAlt  },
      { label: 'Reports', to: ADMIN_PATHS.REPORTS, icon: FaChartBar },
      { label: 'Settings', to: ADMIN_PATHS.SETTINGS, icon: FaCog },
    ],
  },
];

function BrandTile() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
        <img src={logo} alt="komaret logo" 
        className='  '
        />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-bold text-[#071525]">Komaret</p>
        <p className="truncate text-[11px] text-gray-400">Admin console</p>
      </div>
    </div>
  );
}

function NavItems({ onNavigate }) {
  const { hasRole } = useAuth();

  const canSee = (to) => {
    const required = ADMIN_ROUTE_ROLES[to];
    if (!required) return true;
    return required.some((role) => hasRole(role));
  };

  return (
    <nav className="flex flex-col gap-6 px-3 pb-6">
      {NAV_GROUPS.map((group, i) => {
        const items = group.items.filter((item) => canSee(item.to));
        if (items.length === 0) return null;
        return (
          <div key={group.heading || `grp-${i}`} className="flex flex-col gap-1">
            {group.heading && (
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                {group.heading}
              </p>
            )}
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#f5b400]/12 text-[#071525]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#071525]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#f5b400] transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <Icon
                        className={`text-[15px] ${isActive ? 'text-[#f5b400]' : 'text-gray-400 group-hover:text-[#071525]'}`}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}

function AdminHeader({ onOpenMenu }) {
  const { user, logout } = useAuth();
  const roleLabel = Array.isArray(user?.roles) ? user.roles[0] : user?.role;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 md:hidden"
        aria-label="Open menu"
      >
        <FaBars />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <Link
          to={ADMIN_PATHS.PROJECT_CREATE}
          className="hidden items-center gap-2 rounded-lg bg-[#f5b400] px-3.5 py-2 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#dca300] sm:inline-flex"
        >
          <FaPlus className="text-xs" /> New project
        </Link>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#071525] text-xs font-bold text-[#f5b400]">
            {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
          </span>
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-medium text-gray-800">{user?.name || user?.email}</p>
            {roleLabel && (
              <p className="text-[11px] capitalize text-gray-400">{String(roleLabel).toLowerCase()}</p>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600"
            aria-label="Log out"
            title="Log out"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
}

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">

      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="sticky top-0 h-screen overflow-y-auto">
          <BrandTile />
          <NavItems />
        </div>
      </aside>


      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-64 overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between pr-3">
              <BrandTile />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            <NavItems onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;