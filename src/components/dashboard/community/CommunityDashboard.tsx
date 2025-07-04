
import { useParams, Navigate } from 'react-router-dom';
import CommunityDashboardRouter from './CommunityDashboardRouter';

const CommunityDashboard = () => {
  const { communityId } = useParams();

  if (!communityId) {
    return <Navigate to="/dashboard" replace />;
  }

  return <CommunityDashboardRouter />;
};

export default CommunityDashboard;
