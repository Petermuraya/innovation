
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCommunityPointTracking = (communityId?: string) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !communityId) return;

    // Track community dashboard visit when user loads the dashboard
    const trackCommunityDashboardVisit = async () => {
      try {
        const { data, error } = await supabase.rpc('track_community_dashboard_visit', {
          user_id_param: user.id,
          community_id_param: communityId
        });

        if (error) {
          console.error('Error tracking community dashboard visit:', error);
        } else if (data) {
          console.log('Daily community dashboard visit tracked and points awarded');
        }
      } catch (error) {
        console.error('Error in community dashboard visit tracking:', error);
      }
    };

    trackCommunityDashboardVisit();
  }, [user, communityId]);

  const markAttendance = async (
    attendanceType: 'activity' | 'event' | 'workshop',
    sourceId: string
  ) => {
    if (!user || !communityId) return;

    try {
      const params = {
        user_id_param: user.id,
        community_id_param: communityId,
        attendance_type_param: attendanceType,
        marked_by_param: user.id
      };

      // Add the appropriate source ID based on attendance type
      if (attendanceType === 'activity') {
        params['activity_id_param'] = sourceId;
      } else if (attendanceType === 'event') {
        params['event_id_param'] = sourceId;
      } else if (attendanceType === 'workshop') {
        params['workshop_id_param'] = sourceId;
      }

      const { error } = await supabase.rpc('mark_community_attendance', params);

      if (error) throw error;
      console.log(`Attendance marked for ${attendanceType}`);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return { markAttendance };
};
