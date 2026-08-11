import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../shared/hooks/useAuth';
import AdminLayout from './AdminLayout';
import Loading from '../shared/components/common/Loading';
import { ADMIN_PATHS, ADMIN_ROUTE_ROLES } from '../shared/constants/routes';

import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

import Dashboard from './pages/Dashboard/Dashboard';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/Projects/ProjectDetails';
import CreateProject from './pages/Projects/CreateProject';
import EditProject from './pages/Projects/EditProject';
import Machinery from './pages/Machinery/Machinery';
import MachineryDetails from './pages/Machinery/MachineryDetails';
import Labour from './pages/Labour/Labour';
import InteriorDesign from './pages/InteriorDesign/InteriorDesign';
import Renovations from './pages/Renovations/Renovations';
import RealEstate from './pages/RealEstate/RealEstate';
import Quotations from './pages/Quotations/Quotations';
import QuotationDetails from './pages/Quotations/QuotationDetails';
import CreateQuotation from './pages/Quotations/CreateQuotation';
import EditQuotation from './pages/Quotations/EditQuotation';
import CRM from './pages/CRM/CRM';
import ServiceRequests from './pages/ServiceRequests/ServiceRequests';
import Communications from './pages/Communications/Communications';
import Documents from './pages/Documents/Documents';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';

function RequireAuth({ roles }) {
  const { isAuthenticated, status, hasRole } = useAuth();
  const location = useLocation();

  if (status === 'loading' || status === 'idle') {
    return <Loading label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_PATHS.LOGIN} replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.some((role) => hasRole(role))) {
    return <Navigate to={ADMIN_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
}

function AdminRoutes() {
  return (
    <Routes>

      <Route path={ADMIN_PATHS.LOGIN} element={<Login />} />
      <Route path={ADMIN_PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ADMIN_PATHS.RESET_PASSWORD} element={<ResetPassword />} />

      {/* Authenticated back-office */}
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route path={ADMIN_PATHS.DASHBOARD} element={<Dashboard />} />

          <Route path={ADMIN_PATHS.PROJECTS} element={<Projects />} />
          <Route path={ADMIN_PATHS.PROJECT_DETAILS} element={<ProjectDetails />} />
          <Route path={ADMIN_PATHS.PROJECT_CREATE} element={<CreateProject />} />
          <Route path={ADMIN_PATHS.PROJECT_EDIT} element={<EditProject />} />

          <Route path={ADMIN_PATHS.MACHINERY} element={<Machinery />} />
          <Route path={ADMIN_PATHS.MACHINERY_DETAILS} element={<MachineryDetails />} />

          <Route path={ADMIN_PATHS.LABOUR} element={<Labour />} />
          <Route path={ADMIN_PATHS.INTERIOR_DESIGN} element={<InteriorDesign />} />
          <Route path={ADMIN_PATHS.RENOVATIONS} element={<Renovations />} />
          <Route path={ADMIN_PATHS.REAL_ESTATE} element={<RealEstate />} />

          <Route path={ADMIN_PATHS.QUOTATIONS} element={<Quotations />} />
          <Route path={ADMIN_PATHS.QUOTATION_DETAILS} element={<QuotationDetails />} />
          <Route path={ADMIN_PATHS.QUOTATION_CREATE} element={<CreateQuotation />} />
          <Route path={ADMIN_PATHS.QUOTATION_EDIT} element={<EditQuotation />} />

          <Route path={ADMIN_PATHS.CRM} element={<CRM />} />
          <Route path={ADMIN_PATHS.SERVICE_REQUESTS} element={<ServiceRequests />} />
          <Route path={ADMIN_PATHS.COMMUNICATIONS} element={<Communications />} />
          <Route path={ADMIN_PATHS.DOCUMENTS} element={<Documents />} />

    
          <Route element={<RequireAuth roles={ADMIN_ROUTE_ROLES[ADMIN_PATHS.REPORTS]} />}>
            <Route path={ADMIN_PATHS.REPORTS} element={<Reports />} />
          </Route>


          <Route element={<RequireAuth roles={ADMIN_ROUTE_ROLES[ADMIN_PATHS.SETTINGS]} />}>
            <Route path={ADMIN_PATHS.SETTINGS} element={<Settings />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ADMIN_PATHS.DASHBOARD} replace />} />
    </Routes>
  );
}

export default AdminRoutes;
