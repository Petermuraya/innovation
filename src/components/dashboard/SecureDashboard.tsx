
import RegistrationPending from '@/components/auth/RegistrationPending';
import DashboardSwitcher from '@/components/dashboard/DashboardSwitcher';
import DashboardLoadingState from '@/components/dashboard/components/DashboardLoadingState';
import DashboardErrorStates from '@/components/dashboard/components/DashboardErrorStates';
import DashboardContent from '@/components/dashboard/components/DashboardContent';
import { useDashboardPermissions } from '@/components/dashboard/hooks/useDashboardPermissions';
import { useDashboardState } from '@/components/dashboard/hooks/useDashboardState';

const SecureDashboard = () => {
  const {
    user,
    memberData,
    isApproved,
    adminCommunities,
    roleInfo,
    hasAdminAccess,
    isLoading,
    authLoading,
    roleLoading
  } = useDashboardPermissions();

  const { dashboardView, direction, handleViewChange } = useDashboardState({
    hasAdminAccess,
    authLoading,
    roleLoading
  });

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (!user) {
    return null; // This will be handled by ProtectedRoute
  }

  // Check for error states (no member data)
  const errorState = DashboardErrorStates({ memberData, isApproved, hasAdminAccess });
  if (errorState) {
    return errorState;
  }

  // Regular users need approval, but admins can always access
  if (!isApproved && !hasAdminAccess) {
    return <RegistrationPending />;
  }

  console.log('Dashboard render - hasAdminAccess:', hasAdminAccess, 'dashboardView:', dashboardView, 'roleInfo:', roleInfo);

  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-4 sm:p-6">
        {/* Show dashboard switcher for admin users */}
        {hasAdminAccess && (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-blue-800 font-medium">
                  Admin Access Detected: {roleInfo?.assignedRole || 'Admin'} - You can switch between dashboards
                </p>
              </div>
            </div>
            <DashboardSwitcher 
              currentView={dashboardView}
              onViewChange={handleViewChange}
            />
          </>
        )}
        
        {/* Animated Dashboard Content */}
        <DashboardContent
          dashboardView={dashboardView}
          hasAdminAccess={hasAdminAccess}
          roleInfo={roleInfo}
          adminCommunities={adminCommunities || []}
          direction={direction}
        />
      </div>
    </div>
  );
};

export default SecureDashboard;
