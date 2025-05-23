
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserDashboard from '@/components/dashboard/UserDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6">
            <p>Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-kic-lightGray">
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
};

export default Dashboard;
