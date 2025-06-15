
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AttendanceRecord, CommunityMember, CommunityActivity } from '../types';

export const useAttendanceData = (communityId: string) => {
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendanceRecords = async () => {
    try {
      // First get attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('community_attendance_tracking')
        .select('*')
        .eq('community_id', communityId)
        .order('attendance_time', { ascending: false });

      if (attendanceError) throw attendanceError;

      // Then get member information for each attendance record
      const attendanceWithMembers = await Promise.all(
        (attendanceData || []).map(async (record) => {
          const { data: memberData } = await supabase
            .from('members')
            .select('name')
            .eq('user_id', record.user_id)
            .single();

          return {
            id: record.id,
            activity_id: record.activity_id,
            event_id: record.event_id,
            workshop_id: record.workshop_id,
            user_id: record.user_id,
            attended: record.attended,
            attendance_time: record.attendance_time,
            attendance_type: record.attendance_type,
            member_name: memberData?.name || 'Unknown Member',
            activity_title: `${record.attendance_type} - ${record.activity_id || record.event_id || record.workshop_id}`,
          };
        })
      );

      setAttendanceRecords(attendanceWithMembers);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      });
    }
  };

  const fetchMembers = async () => {
    try {
      // Get community memberships
      const { data: memberships, error: membershipsError } = await supabase
        .from('community_memberships')
        .select('user_id')
        .eq('community_id', communityId)
        .eq('status', 'active');

      if (membershipsError) throw membershipsError;

      // Get member details for each membership
      const membersWithDetails = await Promise.all(
        (memberships || []).map(async (membership) => {
          const { data: memberData } = await supabase
            .from('members')
            .select('name')
            .eq('user_id', membership.user_id)
            .single();

          return {
            user_id: membership.user_id,
            name: memberData?.name || 'Unknown Member',
          };
        })
      );

      setMembers(membersWithDetails);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      // Fetch activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('community_activities')
        .select('id, title, scheduled_date')
        .eq('community_id', communityId)
        .order('scheduled_date', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('community_events')
        .select(`
          event_id,
          events!inner(id, title, date)
        `)
        .eq('community_id', communityId);

      if (eventsError) throw eventsError;

      // Fetch workshops
      const { data: workshopsData, error: workshopsError } = await supabase
        .from('community_workshops')
        .select('id, title, start_date')
        .eq('community_id', communityId)
        .order('start_date', { ascending: false })
        .limit(10);

      if (workshopsError) throw workshopsError;

      // Combine all activities
      const allActivities: CommunityActivity[] = [];

      // Add activities
      if (activitiesData) {
        activitiesData.forEach(activity => {
          allActivities.push({
            id: activity.id,
            title: activity.title,
            scheduled_date: activity.scheduled_date,
            type: 'activity'
          });
        });
      }

      // Add events
      if (eventsData) {
        eventsData.forEach(eventItem => {
          if (eventItem.events) {
            allActivities.push({
              id: eventItem.events.id,
              title: eventItem.events.title,
              scheduled_date: eventItem.events.date,
              type: 'event'
            });
          }
        });
      }

      // Add workshops
      if (workshopsData) {
        workshopsData.forEach(workshop => {
          allActivities.push({
            id: workshop.id,
            title: workshop.title,
            scheduled_date: workshop.start_date,
            type: 'workshop'
          });
        });
      }

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAttendanceRecords(),
        fetchMembers(),
        fetchActivities(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [communityId]);

  return {
    attendanceRecords,
    members,
    activities,
    loading,
    refetchAttendance: fetchAttendanceRecords,
  };
};
