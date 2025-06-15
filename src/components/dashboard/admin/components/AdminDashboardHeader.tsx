
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminDashboardHeaderProps {
  roleDisplayName: string;
  isSuperAdmin: boolean;
}

const AdminDashboardHeader = ({ roleDisplayName, isSuperAdmin }: AdminDashboardHeaderProps) => {
  const { user } = useAuth();

  return (
    <>
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
              <div>
                <CardTitle className="text-xl sm:text-2xl">Admin Dashboard</CardTitle>
                <p className="text-sm sm:text-base text-gray-600">
                  Welcome, {roleDisplayName}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Logged in as</p>
              <p className="text-sm sm:text-base font-medium truncate max-w-[200px]">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Super Admin Banner */}
      {isSuperAdmin && (
        <Card>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Super Admin Mode</span>
            </div>
            <p className="text-sm text-yellow-700">
              Full system access - manage all users, roles, and perform administrative actions.
            </p>
          </div>
        </Card>
      )}
    </>
  );
};

export default AdminDashboardHeader;
