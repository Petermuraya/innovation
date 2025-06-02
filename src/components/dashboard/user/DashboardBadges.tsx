
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy, Star, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserBadge {
  id: string;
  badge_type: string;
  category: string;
  description: string;
  points: number;
  earned_at: string;
}

const DashboardBadges = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBadges();
      fetchTotalPoints();
    }
  }, [user]);

  const fetchUserBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('member_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalPoints = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('member_points')
        .select('points')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const total = data?.reduce((sum, point) => sum + point.points, 0) || 0;
      setTotalPoints(total);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'achievement':
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'participation':
        return <Star className="w-6 h-6 text-blue-500" />;
      case 'contribution':
        return <Target className="w-6 h-6 text-green-500" />;
      default:
        return <Award className="w-6 h-6 text-purple-500" />;
    }
  };

  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'achievement':
        return 'bg-yellow-100 border-yellow-300';
      case 'participation':
        return 'bg-blue-100 border-blue-300';
      case 'contribution':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-purple-100 border-purple-300';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            My Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-kic-green-50 rounded-lg">
              <div className="text-2xl font-bold text-kic-green-600">{badges.length}</div>
              <div className="text-sm text-gray-600">Badges Earned</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>

          <div className="space-y-4">
            {badges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No badges earned yet</p>
                <p className="text-sm">Participate in events and submit projects to earn your first badge!</p>
              </div>
            ) : (
              badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getBadgeColor(badge.category)}`}
                >
                  {getBadgeIcon(badge.category)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{badge.badge_type}</h4>
                      <Badge variant="secondary">{badge.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{badge.points} points</span>
                      <span>Earned {new Date(badge.earned_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardBadges;
