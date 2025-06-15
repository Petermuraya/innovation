
import { motion, AnimatePresence } from 'framer-motion';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import CommunityDashboard from '@/components/dashboard/community/CommunityDashboard';

interface DashboardContentProps {
  dashboardView: 'admin' | 'user';
  hasAdminAccess: boolean;
  roleInfo: any;
  adminCommunities: any[];
  direction: number;
}

const DashboardContent = ({ 
  dashboardView, 
  hasAdminAccess, 
  roleInfo, 
  adminCommunities, 
  direction 
}: DashboardContentProps) => {
  // Dashboard transition variants
  const dashboardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const renderDashboard = () => {
    // If user has admin privileges and chooses admin view
    if (hasAdminAccess && dashboardView === 'admin') {
      // Main admins get the full admin dashboard
      if (roleInfo?.assignedRole && roleInfo.assignedRole !== 'member') {
        return <AdminDashboard key="admin" />;
      }
      // Community admins get the community dashboard
      if (adminCommunities && adminCommunities.length > 0) {
        return <CommunityDashboard key="community" />;
      }
      // Fallback to admin dashboard for any admin access
      return <AdminDashboard key="admin" />;
    }
    
    // Default to user dashboard (member view)
    return <UserDashboard key="user" />;
  };

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={dashboardView}
          custom={direction}
          variants={dashboardVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.4 }
          }}
        >
          {renderDashboard()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DashboardContent;
