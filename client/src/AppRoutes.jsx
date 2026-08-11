import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './public/PublicRoutes';
import AdminRoutes from './admin/AdminRoutes';

/** Splits the app in two independent route trees.*/
function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}

export default AppRoutes;
