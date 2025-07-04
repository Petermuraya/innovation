
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCommunityPointTracking = (communityId: string) => {
  const { member } = useAuth();

  useEffect(() => {
    const trackCommunityDashboardVisit = async () => {
      if (!member || !communityId) return;

      try {
        // Track community dashboard visit and potentially award points
        const { data, error } = await supabase.rpc('track_community_dashboard_visit', {
          user_id_param: member.id,
          community_id_param: communityId
        });

        if (error) {
          console.error('Error tracking community dashboard visit:', error);
        } else if (data) {
          console.log('Community dashboard visit tracked and points awarded');
        }
      } catch (error) {
        console.error('Error in community point tracking:', error);
      }
    };

    trackCommunityDashboardVisit();
  }, [member, communityId]);

  const markAttendance = async (attendanceType: string, itemId?: string) => {
    if (!member || !communityId) return;

    try {
      let params: any = {
        user_id_param: member.id,
        community_id_param: communityId,
        attendance_type_param: attendanceType
      };

      // Add specific ID based on attendance type
      if (attendanceType === 'activity' && itemId) {
        params.activity_id_param = itemId;
      } else if (attendanceType === 'event' && itemId) {
        params.event_id_param = itemId;
      } else if (attendanceType === 'workshop' && itemId) {
        params.workshop_id_param = itemId;
      }

      const { error } = await supabase.rpc('mark_community_attendance', params);

      if (error) {
        console.error('Error marking attendance:', error);
      } else {
        console.log(`${attendanceType} attendance marked successfully`);
      }
    } catch (error) {
      console.error('Error in marking attendance:', error);
    }
  };

  return { markAttendance };
};
