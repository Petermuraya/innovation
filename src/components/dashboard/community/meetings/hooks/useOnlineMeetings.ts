
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { OnlineMeeting, MeetingStats } from '../types';
import { meetingsService } from '../services/meetingsService';
import { transformDatabaseMeetings, transformDatabaseMeeting } from '../utils/meetingUtils';

export const useOnlineMeetings = (communityId: string) => {
  const [meetings, setMeetings] = useState<OnlineMeeting[]>([]);
  const [meetingStats, setMeetingStats] = useState<MeetingStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      
      const [meetingsData, statsData] = await Promise.all([
        meetingsService.fetchMeetings(communityId),
        meetingsService.fetchMeetingStats(communityId)
      ]);

      const transformedMeetings = transformDatabaseMeetings(meetingsData || []);
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
      const data = await meetingsService.createMeeting(meetingData);
      const transformedMeeting = transformDatabaseMeeting(data);

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
      const data = await meetingsService.updateMeeting(meetingId, updates);
      const transformedMeeting = transformDatabaseMeeting(data);

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
      await meetingsService.deleteMeeting(meetingId);
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
      const response = await meetingsService.recordAttendance(meetingId);

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
