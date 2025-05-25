
import MemberRanking from '@/components/leaderboard/MemberRanking';
import ProjectLeaderboard from '@/components/leaderboard/ProjectLeaderboard';
import NewsletterSubscription from '@/components/newsletter/NewsletterSubscription';

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Community Leaderboards</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our top contributors, most engaging projects, and recognize the achievements of our community members.
          </p>
        </div>

        <MemberRanking />
        <ProjectLeaderboard />
        
        <div className="flex justify-center">
          <NewsletterSubscription />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
