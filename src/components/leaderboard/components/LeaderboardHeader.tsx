
import { Trophy } from 'lucide-react';

const LeaderboardHeader = () => {
  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-green-600 bg-clip-text text-transparent mb-4">
          Community Leaderboards
        </h1>
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
      <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
        Discover our top contributors, most engaging projects, and recognize the outstanding achievements 
        of our innovation community members. Track progress, compete fairly, and celebrate success together.
      </p>
    </div>
  );
};

export default LeaderboardHeader;
