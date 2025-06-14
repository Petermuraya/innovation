
import { useParams, Navigate } from 'react-router-dom';
import { useCommunityData } from '../user/communities/useCommunityData';
import { Card, CardContent } from '@/components/ui/card';
import IoTCommunityDashboard from './dashboards/IoTCommunityDashboard';
import WebDevCommunityDashboard from './dashboards/WebDevCommunityDashboard';
import AppDevCommunityDashboard from './dashboards/AppDevCommunityDashboard';
import CybersecurityCommunityDashboard from './dashboards/CybersecurityCommunityDashboard';
import DataScienceCommunityDashboard from './dashboards/DataScienceCommunityDashboard';

const CommunityDashboardRouter = () => {
  const { communityId } = useParams();
  const { communities, loading } = useCommunityData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card>
          <CardContent className="p-6">
            <p>Loading community dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!communityId) {
    return <Navigate to="/dashboard" replace />;
  }

  const community = communities.find(c => c.id === communityId);
  
  if (!community) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!community.is_member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kic-lightGray">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You must be a member of this community to access its dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Route to specific community dashboard based on community name
  const communityName = community.name.toLowerCase();
  
  if (communityName.includes('iot') || communityName.includes('internet of things')) {
    return <IoTCommunityDashboard community={community} />;
  }
  
  if (communityName.includes('web') && communityName.includes('development')) {
    return <WebDevCommunityDashboard community={community} />;
  }
  
  if (communityName.includes('app') && communityName.includes('development')) {
    return <AppDevCommunityDashboard community={community} />;
  }
  
  if (communityName.includes('cybersecurity') || communityName.includes('cyber security')) {
    return <CybersecurityCommunityDashboard community={community} />;
  }
  
  if (communityName.includes('data science') || communityName.includes('machine learning')) {
    return <DataScienceCommunityDashboard community={community} />;
  }

  // Default fallback dashboard for unrecognized communities
  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Community Dashboard</h2>
            <p className="text-gray-600 mb-4">Welcome to {community.name}</p>
            <p className="text-sm text-gray-500">
              This community dashboard is currently under development.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityDashboardRouter;
