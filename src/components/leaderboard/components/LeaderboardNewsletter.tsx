
import { Card, CardContent } from '@/components/ui/card';
import NewsletterSubscription from '@/components/newsletter/NewsletterSubscription';

const LeaderboardNewsletter = () => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-yellow-600 text-white">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">Stay Updated with Rankings</h3>
          <p className="text-green-100 max-w-2xl mx-auto">
            Get weekly updates on leaderboard changes, new achievements, and community highlights delivered to your inbox.
          </p>
          <div className="flex justify-center mt-6">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <NewsletterSubscription />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardNewsletter;
