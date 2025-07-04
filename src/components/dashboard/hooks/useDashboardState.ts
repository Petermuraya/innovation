
import { useState, useEffect } from 'react';

interface UseDashboardStateProps {
  hasAdminAccess: boolean;
  authLoading: boolean;
  roleLoading: boolean;
}

export const useDashboardState = ({ hasAdminAccess, authLoading, roleLoading }: UseDashboardStateProps) => {
  const [dashboardView, setDashboardView] = useState<'admin' | 'user'>('user');
  const [direction, setDirection] = useState(0);

  // Effect to set default view based on admin status
  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (hasAdminAccess) {
        console.log('User has admin access, defaulting to admin view');
        setDashboardView('admin');
      } else {
        console.log('User does not have admin access, setting user view');
        setDashboardView('user');
      }
    }
  }, [hasAdminAccess, authLoading, roleLoading]);

  const handleViewChange = (newView: 'admin' | 'user') => {
    if (newView !== dashboardView) {
      setDirection(newView === 'admin' ? 1 : -1);
      setDashboardView(newView);
      console.log('Dashboard view changed to:', newView, 'by admin user');
    }
  };

  return {
    dashboardView,
    direction,
    handleViewChange
  };
};
