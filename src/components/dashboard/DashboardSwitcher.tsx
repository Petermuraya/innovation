
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, User, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';

interface DashboardSwitcherProps {
  currentView: 'admin' | 'user';
  onViewChange: (view: 'admin' | 'user') => void;
}

const DashboardSwitcher = ({ currentView, onViewChange }: DashboardSwitcherProps) => {
  const { isAdmin } = useAuth();
  const { roleInfo, loading } = useRolePermissions();

  if (loading || !isAdmin || !roleInfo) {
    return null;
  }

  const handleToggle = (checked: boolean) => {
    onViewChange(checked ? 'admin' : 'user');
  };

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

  return (
    <Card className="mb-6 border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {currentView === 'admin' ? (
                <Shield className="w-5 h-5 text-blue-600" />
              ) : (
                <User className="w-5 h-5 text-green-600" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentView === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}
                </h3>
                <p className="text-sm text-gray-600">
                  {currentView === 'admin' 
                    ? `${getRoleDisplayName(roleInfo.assignedRole)} view`
                    : 'Standard member view'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Member</span>
              <Switch
                checked={currentView === 'admin'}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Switch between your administrative and member dashboard views
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardSwitcher;
