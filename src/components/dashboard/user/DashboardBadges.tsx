
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy } from 'lucide-react';

interface BadgeData {
  id: string;
  name: string;
  description: string;
  type: string;
  points: number;
  earned_at: string;
}

const DashboardBadges: React.FC = () => {
  const { member } = useAuth();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (member) {
      fetchBadges();
    }
  }, [member]);

  const fetchBadges = async () => {
    if (!member) return;

    try {
      // This would fetch from a badges table when implemented
      // For now, showing placeholder content
      const placeholderBadges: BadgeData[] = [
        {
          id: '1',
          name: 'First Project',
          description: 'Submitted your first project',
          type: 'achievement',
          points: 50,
          earned_at: new Date().toISOString()
        }
      ];
      
      setBadges(placeholderBadges);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Badges & Achievements</h3>
        <p className="text-muted-foreground">Track your accomplishments and milestones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => (
          <Card key={badge.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-kic-green-100 rounded-lg">
                  {badge.type === 'achievement' && <Award className="w-6 h-6 text-kic-green-600" />}
                  {badge.type === 'star' && <Star className="w-6 h-6 text-kic-green-600" />}
                  {badge.type === 'trophy' && <Trophy className="w-6 h-6 text-kic-green-600" />}
                </div>
                <div>
                  <CardTitle className="text-base">{badge.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {new Date(badge.earned_at).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {badge.description}
              </p>
              <Badge variant="secondary">
                {badge.points} points
              </Badge>
            </CardContent>
          </Card>
        ))}

        {badges.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No badges earned yet. Start participating to earn your first badge!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardBadges;
