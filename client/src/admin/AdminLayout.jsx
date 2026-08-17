import { useEffect, useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  FaThLarge,
  FaHardHat,
  FaLayerGroup,
  FaTruck,
  FaUsersCog,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaAddressBook,
  FaNewspaper,
  FaComments,
  FaMoneyBillWaveAlt,
  FaChartBar,
  FaCog,
  FaPlus,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChevronDown,
} from 'react-icons/fa';

import useAuth from '../shared/hooks/useAuth';
import { ADMIN_PATHS, ADMIN_ROUTE_ROLES } from '../shared/constants/routes';
import logo from "../assets/images/logo.svg"

const NAVY = '#071525';
const GOLD = '#f5b400';

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
      { label: 'News', to: ADMIN_PATHS.NEWS, icon: FaNewspaper },
      { label: 'Communications', to: ADMIN_PATHS.COMMUNICATIONS, icon: FaComments },
      { label: 'Payments', to: ADMIN_PATHS.PAYMENTS, icon: FaMoneyBillWaveAlt },
      { label: 'Reports', to: ADMIN_PATHS.REPORTS, icon: FaChartBar },
      { label: 'Settings', to: ADMIN_PATHS.SETTINGS, icon: FaCog },
    ],
  },
];

// Flat lookup used to build the header's current-page label without
// touching routing/functionality — purely presentational.
const PAGE_TITLES = NAV_GROUPS.flatMap((g) => g.items).reduce((acc, item) => {
  acc[item.to] = item.label;
  return acc;
}, {});

function currentPageLabel(pathname) {
  if (pathname === ADMIN_PATHS.DASHBOARD) return 'Dashboard';
  const match = Object.keys(PAGE_TITLES)
    .filter((path) => path !== ADMIN_PATHS.DASHBOARD && pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_TITLES[match] : '';
}

function BrandTile() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <img src={logo} alt="Komaret logo" className="h-9 w-9 shrink-0 object-contain" />
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
    <nav className="flex flex-col gap-5 px-3 py-4">
      {NAV_GROUPS.map((group, i) => {
        const items = group.items.filter((item) => canSee(item.to));
        if (items.length === 0) return null;
        return (
          <div key={group.heading || `grp-${i}`} className="flex flex-col gap-0.5">
            {group.heading && (
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
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
                    `group relative flex items-center gap-3 rounded-lg py-2 pl-4 pr-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#f5b400]/10 text-[#071525]'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#071525]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[#f5b400] transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                      <Icon
                        className={`shrink-0 text-[15px] ${
                          isActive ? 'text-[#f5b400]' : 'text-gray-400 group-hover:text-[#071525]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
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

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const roleLabel = Array.isArray(user?.roles) ? user.roles[0] : user?.role;

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);

  return (
    <div className="relative border-l border-gray-200 pl-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-gray-50"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#071525] text-xs font-bold text-[#f5b400]">
          {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
        </span>
        <span className="hidden text-right leading-tight sm:block">
          <span className="block max-w-[9rem] truncate text-sm font-medium text-gray-800">
            {user?.name || user?.email}
          </span>
          {roleLabel && (
            <span className="block truncate text-[11px] capitalize text-gray-400">
              {String(roleLabel).toLowerCase()}
            </span>
          )}
        </span>
        <FaChevronDown className={`hidden text-[10px] text-gray-400 transition-transform sm:block ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-30 mt-2 w-44 rounded-lg border border-gray-200 bg-white py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600"
          >
            <FaSignOutAlt className="text-xs" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

function AdminHeader({ onOpenMenu }) {
  const location = useLocation();
  const pageLabel = currentPageLabel(location.pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
          aria-label="Open menu"
        >
          <FaBars />
        </button>
        <p className="hidden truncate text-sm font-semibold text-[#071525] md:block">
          {pageLabel}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to={ADMIN_PATHS.PROJECT_CREATE}
          className="hidden items-center gap-2 rounded-lg bg-[#f5b400] px-3.5 py-2 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#dca300] sm:inline-flex"
        >
          <FaPlus className="text-xs" /> New project
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto">
          <div className="border-b border-gray-100">
            <BrandTile />
          </div>
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
          <div className="absolute left-0 top-0 flex h-full w-72 max-w-[85vw] flex-col overflow-y-auto bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 pr-3">
              <BrandTile />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100"
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
