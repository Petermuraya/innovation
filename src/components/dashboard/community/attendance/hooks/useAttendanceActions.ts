
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAttendanceActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleMarkAttendance = async (
    communityId: string,
    activityType: 'activity' | 'event' | 'workshop',
    activityId: string,
    memberAttendance: Record<string, boolean>,
    onSuccess?: () => void
  ) => {
    try {
      const attendancePromises = Object.entries(memberAttendance).map(([userId, attended]) => {
        if (!attended) return Promise.resolve();

        const params = {
          user_id_param: userId,
          community_id_param: communityId,
          attendance_type_param: activityType,
          marked_by_param: user?.id,
        };

        if (activityType === 'activity') {
          params['activity_id_param'] = activityId;
        } else if (activityType === 'event') {
          params['event_id_param'] = activityId;
        } else if (activityType === 'workshop') {
          params['workshop_id_param'] = activityId;
        }

        return supabase.rpc('mark_community_attendance', params);
      });

      await Promise.all(attendancePromises);

      toast({
        title: "Attendance marked",
        description: "Attendance has been successfully recorded and points awarded",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  return {
    handleMarkAttendance,
  };
};
