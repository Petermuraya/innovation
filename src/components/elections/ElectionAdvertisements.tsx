
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye } from 'lucide-react';

interface ElectionAd {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  candidate_name: string;
  position_type: string;
  election_title: string;
}

interface ElectionAdvertisementsProps {
  maxAds?: number;
  showTitle?: boolean;
}

const ElectionAdvertisements = ({ maxAds = 3, showTitle = true }: ElectionAdvertisementsProps) => {
  const [ads, setAds] = useState<ElectionAd[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRandomAds = async () => {
    try {
      const { data, error } = await supabase.rpc('get_random_election_ads', {
        limit_count: maxAds
      });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching election ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (adId: string) => {
    try {
      await supabase.rpc('track_ad_impression', {
        ad_id: adId,
        user_id_param: (await supabase.auth.getUser()).data.user?.id || null,
        session_id_param: sessionStorage.getItem('session_id') || Math.random().toString(36)
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  useEffect(() => {
    fetchRandomAds();
    
    // Refresh ads every 30 seconds
    const interval = setInterval(fetchRandomAds, 30000);
    return () => clearInterval(interval);
  }, [maxAds]);

  useEffect(() => {
    // Track impressions for visible ads
    ads.forEach(ad => {
      trackImpression(ad.id);
    });
  }, [ads]);

  if (loading) {
    return (
      <div className="space-y-4">
        {showTitle && <h3 className="text-lg font-semibold">Election Campaigns</h3>}
        <div className="grid gap-4">
          {Array.from({ length: maxAds }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-20 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {showTitle && <h3 className="text-lg font-semibold text-gray-800">Election Campaigns</h3>}
      <div className="grid gap-4">
        {ads.map((ad) => (
          <Card key={ad.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{ad.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {ad.position_type.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{ad.content}</p>
              
              {ad.image_url && (
                <img 
                  src={ad.image_url} 
                  alt={ad.title}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-blue-600">{ad.candidate_name}</p>
                  <p className="text-xs text-gray-500">{ad.election_title}</p>
                </div>
                
                {ad.video_url && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={ad.video_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Watch
                    </a>
                  </Button>
                )}
              </div>
              
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Eye className="w-3 h-3 mr-1" />
                Campaign Advertisement
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ElectionAdvertisements;
