
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMemberDashboard } from '@/hooks/useMemberDashboard';
import ModernUserDashboard from './ModernUserDashboard';
import AdminDashboard from './AdminDashboard';
import ViewSwitcher from './components/ViewSwitcher';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';

const SecureDashboard = () => {
  const { member } = useAuth();
  const { memberData, isApproved, adminCommunities, roleInfo, hasAdminAccess, isLoading, authLoading, roleLoading } = useMemberDashboard();
  const [currentView, setCurrentView] = useState<'admin' | 'user'>('user');

  if (authLoading || roleLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-kic-green-500" />
              <p className="text-gray-600">Loading dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!member || !memberData) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <p className="text-red-600">Authentication required. Please log in.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!isApproved) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <p className="text-yellow-600">Your membership is pending approval. Please wait for admin approval.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {hasAdminAccess && (
          <ViewSwitcher 
            currentView={currentView} 
            onViewChange={setCurrentView} 
          />
        )}
        
        {currentView === 'admin' && hasAdminAccess ? (
          <AdminDashboard />
        ) : (
          <ModernUserDashboard />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SecureDashboard;
