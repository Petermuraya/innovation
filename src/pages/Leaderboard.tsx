
import { useState } from 'react';
import LeaderboardHeader from '@/components/leaderboard/components/LeaderboardHeader';
import LeaderboardStats from '@/components/leaderboard/components/LeaderboardStats';
import LeaderboardFilters from '@/components/leaderboard/components/LeaderboardFilters';
import LeaderboardTabs from '@/components/leaderboard/components/LeaderboardTabs';
import LeaderboardNewsletter from '@/components/leaderboard/components/LeaderboardNewsletter';
import LeaderboardAchievements from '@/components/leaderboard/components/LeaderboardAchievements';

const Leaderboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const handleClearFilters = () => {
    setSearchTerm('');
    setMemberFilter('all');
    setProjectFilter('all');
    setTimeFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-yellow-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <LeaderboardHeader />
        
        {/* Stats Cards */}
        <LeaderboardStats />

        {/* Filters and Search */}
        <LeaderboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          memberFilter={memberFilter}
          setMemberFilter={setMemberFilter}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          onClearFilters={handleClearFilters}
        />

        {/* Tabs Section */}
        <LeaderboardTabs
          searchTerm={searchTerm}
          memberFilter={memberFilter}
          projectFilter={projectFilter}
          timeFilter={timeFilter}
        />

        {/* Newsletter Section */}
        <LeaderboardNewsletter />

        {/* Achievement Highlights */}
        <LeaderboardAchievements />
      </div>
    </div>
  );
};

export default Leaderboard;
