
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboardHeader = () => {
  const { member, memberRole } = useAuth();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-kic-gray">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {member?.email}</p>
      </div>
      <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-800">
        <Shield className="w-4 h-4 mr-2" />
        {memberRole || 'Admin'}
      </Badge>
    </div>
  );
};

export default AdminDashboardHeader;
