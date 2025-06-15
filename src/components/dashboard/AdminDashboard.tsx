
import { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import AdminDashboardHeader from './admin/components/AdminDashboardHeader';
import AdminDashboardTabs from './admin/components/AdminDashboardTabs';
import AdminDashboardContent from './admin/components/AdminDashboardContent';
import SuperAdminGraphStats from './admin/SuperAdminGraphStats';
import DashboardAnimationWrapper from './DashboardAnimationWrapper';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { roleInfo, loading, isSuperAdmin, isChairman } = useRolePermissions();
  const [activeTab, setActiveTab] = useState('members');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'super_admin': 'Super Admin',
      'general_admin': 'General Admin', 
      'community_admin': 'Community Admin',
      'events_admin': 'Events Admin',
      'projects_admin': 'Projects Admin',
      'finance_admin': 'Finance Admin',
      'content_admin': 'Content Admin',
      'technical_admin': 'Technical Admin',
      'marketing_admin': 'Marketing Admin',
      'chairman': 'Chairman',
      'vice_chairman': 'Vice Chairman'
    };
    return roleNames[role] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Show user management tabs for super admins and chairman
  const canManageUsers = isSuperAdmin || isChairman;
  const roleDisplayName = roleInfo?.assignedRole ? getRoleDisplayName(roleInfo.assignedRole) : 'Administrator';

  // Sample stats for the graph component - in real implementation, this would come from your data hooks
  const sampleStats = {
    totalMembers: 156,
    pendingMembers: 12,
    totalEvents: 28,
    pendingProjects: 8,
    totalPayments: 45000,
    totalCertificates: 89,
    pendingAdminRequests: 3,
  };

  return (
    <DashboardAnimationWrapper>
      <div className="space-y-6">
        <AdminDashboardHeader 
          roleDisplayName={roleDisplayName}
          isSuperAdmin={isSuperAdmin}
        />

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AdminDashboardTabs canManageUsers={canManageUsers} />
          <AdminDashboardContent canManageUsers={canManageUsers} />
        </Tabs>

        {/* Super Admin Graph Statistics */}
        {isSuperAdmin && (
          <div className="mt-8">
            <SuperAdminGraphStats stats={sampleStats} />
          </div>
        )}
      </div>
    </DashboardAnimationWrapper>
  );
};

export default AdminDashboard;
