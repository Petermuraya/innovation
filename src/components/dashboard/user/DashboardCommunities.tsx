
import { useCommunityData } from './communities/useCommunityData';
import { useCommunityActions } from './communities/useCommunityActions';
import CommunitiesHeader from './communities/CommunitiesHeader';
import JoinedCommunityCard from './communities/JoinedCommunityCard';
import AvailableCommunityCard from './communities/AvailableCommunityCard';
import CommunitiesEmptyState from './communities/CommunitiesEmptyState';

const DashboardCommunities = () => {
  const { communities, loading, userMembershipCount, refreshData } = useCommunityData();
  const { visitingCommunity, visitCommunity, toggleMembership } = useCommunityActions(
    userMembershipCount,
    refreshData
  );

  if (loading) {
    return <div className="text-center py-8">Loading communities...</div>;
  }

  const myCommunities = communities.filter(c => c.is_member);
  const availableCommunities = communities.filter(c => !c.is_member);

  return (
    <div className="space-y-6">
      <CommunitiesHeader userMembershipCount={userMembershipCount} />

      {/* My Communities */}
      {myCommunities.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Joined Communities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCommunities.map((community) => (
              <JoinedCommunityCard
                key={community.id}
                community={community}
                visitingCommunity={visitingCommunity}
                userMembershipCount={userMembershipCount}
                onVisit={visitCommunity}
                onToggleMembership={toggleMembership}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Communities */}
      {availableCommunities.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Available Communities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableCommunities.map((community) => (
              <AvailableCommunityCard
                key={community.id}
                community={community}
                userMembershipCount={userMembershipCount}
                onToggleMembership={toggleMembership}
              />
            ))}
          </div>
        </div>
      )}

      {communities.length === 0 && <CommunitiesEmptyState />}
    </div>
  );
};

export default DashboardCommunities;
