import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../shared/hooks/useAuth";
import AdminLayout from "./AdminLayout";
import Loading from "../shared/components/common/Loading";
import {
  ADMIN_PATHS,
  ADMIN_ROUTE_PATHS,
  ADMIN_ROUTE_ROLES,
} from "../shared/constants/routes";

import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import CreateProject from "./pages/Projects/CreateProject";
import EditProject from "./pages/Projects/EditProject";
import ServicesLayout from "./pages/Services/ServicesLayout";
import Services from "./pages/Services/Services";
import CreateService from "./pages/Services/CreateService";
import EditService from "./pages/Services/EditService";
import ServiceDetails from "./pages/Services/ServiceDetails";
import ServiceRequests from "./pages/Services/ServiceRequests";
import Machinery from "./pages/Machinery/Machinery";
import CreateMachinery from "./pages/Machinery/CreateMachinery";
import EditMachinery from "./pages/Machinery/EditMachinery";
import MachineryDetails from "./pages/Machinery/MachineryDetails";
import Labour from "./pages/Labour/Labour";
import CreateLabour from "./pages/Labour/CreateLabour";
import EditLabour from "./pages/Labour/EditLabour";
import Quotations from "./pages/Quotations/Quotations";
import QuotationDetails from "./pages/Quotations/QuotationDetails";
import CreateQuotation from "./pages/Quotations/CreateQuotation";
import EditQuotation from "./pages/Quotations/EditQuotation";
import CRM from "./pages/CRM/CRM";
import News from "./pages/News/News";
import CreateNews from "./pages/News/CreateNews";
import EditNews from "./pages/News/EditNews";
import Communications from "./pages/Communications/Communications";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import Payments from "./pages/Payments/Payments";

function RequireAuth({ roles }) {
  const { isAuthenticated, status, hasRole } = useAuth();
  const location = useLocation();

  if (status === "loading" || status === "idle") {
    return <Loading label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ADMIN_PATHS.LOGIN} replace state={{ from: location }} />
    );
  }

  if (roles && roles.length > 0 && !roles.some((role) => hasRole(role))) {
    return <Navigate to={ADMIN_PATHS.DASHBOARD} replace />;
  }

  return <Outlet />;
}

function AdminRoutes() {
  return (
    <Routes>

      <Route path={ADMIN_ROUTE_PATHS.LOGIN} element={<Login />} />
      <Route
        path={ADMIN_ROUTE_PATHS.FORGOT_PASSWORD}
        element={<ForgotPassword />}
      />
      <Route
        path={ADMIN_ROUTE_PATHS.RESET_PASSWORD}
        element={<ResetPassword />}
      />

      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />

          <Route path={ADMIN_ROUTE_PATHS.PROJECTS} element={<Projects />} />
          <Route
            path={ADMIN_ROUTE_PATHS.PROJECT_DETAILS}
            element={<ProjectDetails />}
          />
          <Route
            path={ADMIN_ROUTE_PATHS.PROJECT_CREATE}
            element={<CreateProject />}
          />
          <Route
            path={ADMIN_ROUTE_PATHS.PROJECT_EDIT}
            element={<EditProject />}
          />

          <Route path={ADMIN_ROUTE_PATHS.SERVICES} element={<ServicesLayout />}>
            <Route index element={<Services />} />
            <Route path="new" element={<CreateService />} />
            <Route path="machinery" element={<Machinery />} />
            <Route path="machinery/new" element={<CreateMachinery />} />
            <Route path="machinery/:id" element={<MachineryDetails />} />
            <Route path="machinery/:id/edit" element={<EditMachinery />} />
            <Route path="labour" element={<Labour />} />
            <Route path="labour/new" element={<CreateLabour />} />
            <Route path="labour/:id/edit" element={<EditLabour />} />
            <Route path=":id" element={<ServiceDetails />} />
            <Route path=":id/edit" element={<EditService />} />
          </Route>

          <Route path={ADMIN_ROUTE_PATHS.QUOTATIONS} element={<Quotations />} />
          <Route
            path={ADMIN_ROUTE_PATHS.QUOTATION_DETAILS}
            element={<QuotationDetails />}
          />
          <Route
            path={ADMIN_ROUTE_PATHS.QUOTATION_CREATE}
            element={<CreateQuotation />}
          />
          <Route
            path={ADMIN_ROUTE_PATHS.QUOTATION_EDIT}
            element={<EditQuotation />}
          />

          <Route path={ADMIN_ROUTE_PATHS.CRM} element={<CRM />} />

          <Route path={ADMIN_ROUTE_PATHS.NEWS} element={<News />} />
          <Route path={ADMIN_ROUTE_PATHS.NEWS_CREATE} element={<CreateNews />} />
          <Route path={ADMIN_ROUTE_PATHS.NEWS_EDIT} element={<EditNews />} />

          <Route
            path={ADMIN_ROUTE_PATHS.SERVICE_REQUESTS}
            element={<ServiceRequests />}
          />
          <Route
            path={ADMIN_ROUTE_PATHS.COMMUNICATIONS}
            element={<Communications />}
          />
          <Route path={ADMIN_ROUTE_PATHS.PAYMENTS} element={<Payments />} />

          <Route
            element={
              <RequireAuth roles={ADMIN_ROUTE_ROLES[ADMIN_PATHS.REPORTS]} />
            }
          >
            <Route path={ADMIN_ROUTE_PATHS.REPORTS} element={<Reports />} />
          </Route>

          <Route
            element={
              <RequireAuth roles={ADMIN_ROUTE_ROLES[ADMIN_PATHS.SETTINGS]} />
            }
          >
            <Route path={ADMIN_ROUTE_PATHS.SETTINGS} element={<Settings />} />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to={ADMIN_PATHS.DASHBOARD} replace />}
      />
    </Routes>
  );
}

export default AdminRoutes;