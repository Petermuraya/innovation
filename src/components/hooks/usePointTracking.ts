
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const usePointTracking = () => {
  const { member } = useAuth();

  useEffect(() => {
    if (!member) return;

    // Track website visit when user loads the app
    const trackWebsiteVisit = async () => {
      try {
        const { data, error } = await supabase.rpc('track_website_visit', {
          user_id_param: member.id
        });

        if (error) {
          console.error('Error tracking website visit:', error);
        } else if (data) {
          console.log('Daily website visit tracked and points awarded');
        }
      } catch (error) {
        console.error('Error in website visit tracking:', error);
      }
    };

    trackWebsiteVisit();
  }, [member]);

  const awardPoints = async (activityType: string, sourceId?: string, description?: string) => {
    if (!member) return;

    try {
      const { error } = await supabase.rpc('award_activity_points', {
        user_id_param: member.id,
        activity_type_param: activityType,
        source_id_param: sourceId || null,
        description_param: description || null
      });

      if (error) throw error;
      console.log(`Points awarded for ${activityType}`);
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  return { awardPoints };
};
