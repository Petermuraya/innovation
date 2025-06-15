
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardStats from './DashboardStats';
import DashboardBadges from './DashboardBadges';
import { useMemberData } from './hooks/useMemberData';
import { useUserStats } from './hooks/useUserStats';

const DashboardOverview = () => {
  const { memberData, isLoading: memberLoading } = useMemberData();
  const { stats, isLoading: statsLoading } = useUserStats();

  if (memberLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <DashboardBadges />
    </div>
  );
};

export default DashboardOverview;
