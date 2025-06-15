
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OnlineMeeting, MeetingStats } from '../types';

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

      setMeetings(meetingsData || []);
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

      setMeetings(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Meeting scheduled successfully",
      });

      return data;
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

      setMeetings(prev => prev.map(m => m.id === meetingId ? data : m));
      toast({
        title: "Success",
        description: "Meeting updated successfully",
      });

      return data;
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

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        await fetchMeetings(); // Refresh stats
      } else {
        toast({
          title: "Info",
          description: data.message,
          variant: "default",
        });
      }

      return data;
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
