import { Routes, Route } from 'react-router-dom';
import DashboardSettings from './user/DashboardSettings';
import ModernUserDashboard from './ModernUserDashboard';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<ModernUserDashboard />} />
      <Route path="settings" element={<DashboardSettings />} />
    </Routes>
  );
};

export default DashboardRoutes;