import { Routes, Route } from 'react-router-dom';
import DashboardSettings from './user/DashboardSettings';
import DashboardProfile from './user/DashboardProfile';
import DashboardCommunities from './user/DashboardCommunities';
import DashboardCertificates from './user/DashboardCertificates';
import DashboardPayments from './user/DashboardPayments';
import DashboardNotifications from './user/DashboardNotifications';
import DashboardAnalytics from './user/DashboardAnalytics';
import ModernUserDashboard from './ModernUserDashboard';
import { useAuth } from '@/contexts/AuthContext';

const DashboardRoutes = () => {
  const { member } = useAuth();

  return (
    <Routes>
      <Route index element={<ModernUserDashboard />} />
      <Route path="profile" element={<DashboardProfile memberData={member} onUpdate={() => {}} />} />
      <Route path="communities" element={<DashboardCommunities />} />
      <Route path="certificates" element={<DashboardCertificates certificates={[]} />} />
      <Route path="payments" element={<DashboardPayments />} />
      <Route path="notifications" element={<DashboardNotifications />} />
      <Route path="analytics" element={<DashboardAnalytics />} />
      <Route path="settings" element={<DashboardSettings />} />
    </Routes>
  );
};

export default DashboardRoutes;