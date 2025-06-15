
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberStatus } from '@/hooks/useMemberStatus';
import { useCommunityAdminData } from '@/hooks/useCommunityAdminData';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import CommunityDashboard from '@/components/dashboard/community/CommunityDashboard';
import RegistrationPending from '@/components/auth/RegistrationPending';
import DashboardSwitcher from '@/components/dashboard/DashboardSwitcher';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SecureDashboard = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { loading: statusLoading, isApproved, memberData } = useMemberStatus();
  const { communities: adminCommunities, loading: communityLoading } = useCommunityAdminData();
  const [dashboardView, setDashboardView] = useState<'admin' | 'user'>('admin');

  if (authLoading || statusLoading || communityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p>Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return null; // This will be handled by ProtectedRoute
  }

  // Check if user is not registered at all (no member record)
  if (!memberData) {
    return (
      <div className="min-h-screen bg-kic-lightGray">
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="max-w-2xl mx-auto border-red-500 bg-red-50">
            <UserX className="h-4 w-4" />
            <AlertDescription className="text-red-800 font-medium">
              You are not a registered member of KIC. Please complete your registration to access the dashboard.
            </AlertDescription>
          </Alert>
          
          <Card className="max-w-2xl mx-auto mt-6">
            <CardContent className="p-6 text-center">
              <UserX className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600 mb-4">
                Your account is not registered with the Karatina Innovation Club. 
                To access the dashboard and participate in club activities, you need to:
              </p>
              <div className="text-left bg-gray-50 p-4 rounded-lg mb-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                  <li>Complete the member registration process</li>
                  <li>Wait for admin approval</li>
                  <li>Complete payment for registration and subscription</li>
                </ol>
              </div>
              <p className="text-sm text-gray-500">
                Please contact the club administrators for assistance with registration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Regular users need approval
  if (!isApproved && !isAdmin) {
    return <RegistrationPending />;
  }

  // Determine if user can access admin features
  const canAccessAdmin = isAdmin || (adminCommunities && adminCommunities.length > 0);

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

  const [direction, setDirection] = useState(0);

  const handleViewChange = (newView: 'admin' | 'user') => {
    if (newView !== dashboardView) {
      setDirection(newView === 'admin' ? 1 : -1);
      setDashboardView(newView);
    }
  };

  // Handle dashboard view logic
  const renderDashboard = () => {
    // If user has admin privileges and chooses admin view
    if (canAccessAdmin && dashboardView === 'admin') {
      // Main admins get the full admin dashboard
      if (isAdmin) {
        return <AdminDashboard key="admin" />;
      }
      // Community admins get the community dashboard
      if (adminCommunities && adminCommunities.length > 0) {
        return <CommunityDashboard key="community" />;
      }
    }
    
    // Default to user dashboard (member view)
    return <UserDashboard key="user" />;
  };

  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Show dashboard switcher only for users with admin privileges */}
        {canAccessAdmin && (
          <DashboardSwitcher 
            currentView={dashboardView}
            onViewChange={handleViewChange}
          />
        )}
        
        {/* Animated Dashboard Content */}
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
      </div>
    </div>
  );
};

export default SecureDashboard;
