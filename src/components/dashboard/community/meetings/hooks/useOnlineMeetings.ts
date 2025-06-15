
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OnlineMeeting, MeetingStats } from '../types';

// Define the database response type to handle the status field properly
interface DatabaseMeeting {
  id: string;
  community_id: string;
  title: string;
  description?: string;
  meeting_link: string;
  scheduled_date: string;
  duration_minutes: number;
  max_participants?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  status: string; // This comes as a generic string from the database
}

// Define the RPC response type
interface AttendanceResponse {
  success: boolean;
  message: string;
}

export const useOnlineMeetings = (communityId: string) => {
  const [meetings, setMeetings] = useState<OnlineMeeting[]>([]);
  const [meetingStats, setMeetingStats] = useState<MeetingStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      
      // Fetch meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('community_online_meetings')
        .select('*')
        .eq('community_id', communityId)
        .order('scheduled_date', { ascending: true });

      if (meetingsError) throw meetingsError;

      // Fetch meeting statistics
      const { data: statsData, error: statsError } = await supabase
        .from('community_meeting_stats')
        .select('*')
        .eq('community_id', communityId);

      if (statsError) throw statsError;

      // Transform the database response to match our OnlineMeeting type
      const transformedMeetings: OnlineMeeting[] = (meetingsData || []).map((meeting: DatabaseMeeting) => ({
        ...meeting,
        status: meeting.status as OnlineMeeting['status'] // Type assertion to match our union type
      }));

      setMeetings(transformedMeetings);
      setMeetingStats(statsData || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast({
        title: "Error",
        description: "Failed to load meetings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (meetingData: Omit<OnlineMeeting, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('community_online_meetings')
        .insert([meetingData])
        .select()
        .single();

      if (error) throw error;

      // Transform the response to match our OnlineMeeting type
      const transformedMeeting: OnlineMeeting = {
        ...data,
        status: data.status as OnlineMeeting['status']
      };

      setMeetings(prev => [...prev, transformedMeeting]);
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });

      return transformedMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMeeting = async (meetingId: string, updates: Partial<OnlineMeeting>) => {
    try {
      const { data, error } = await supabase
        .from('community_online_meetings')
        .update(updates)
        .eq('id', meetingId)
        .select()
        .single();

      if (error) throw error;

      // Transform the response to match our OnlineMeeting type
      const transformedMeeting: OnlineMeeting = {
        ...data,
        status: data.status as OnlineMeeting['status']
      };

      setMeetings(prev => prev.map(m => m.id === meetingId ? transformedMeeting : m));
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });

      return transformedMeeting;
    } catch (error) {
      console.error('Error updating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to update meeting",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      const { error } = await supabase
        .from('community_online_meetings')
        .delete()
        .eq('id', meetingId);

      if (error) throw error;

      setMeetings(prev => prev.filter(m => m.id !== meetingId));
      toast({
        title: "Success",
        description: "Meeting deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive",
      });
      throw error;
    }
  };

  const recordAttendance = async (meetingId: string) => {
    try {
      const { data, error } = await supabase.rpc('record_meeting_attendance', {
        meeting_id_param: meetingId
      });

      if (error) throw error;

      // Type assertion for the RPC response
      const response = data as AttendanceResponse;

      if (response.success) {
        toast({
          title: "Success",
          description: response.message,
        });
        await fetchMeetings(); // Refresh stats
      } else {
        toast({
          title: "Info",
          description: response.message,
          variant: "default",
        });
      }

      return response;
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast({
        title: "Error",
        description: "Failed to record attendance",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchMeetings();
    }
  }, [communityId]);

  return {
    meetings,
    meetingStats,
    loading,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    recordAttendance,
    refetch: fetchMeetings,
  };
};
