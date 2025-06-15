
import { supabase } from '@/integrations/supabase/client';
import { OnlineMeeting } from '../types';

export interface DatabaseMeeting {
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
  status: string;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
}

export const meetingsService = {
  async fetchMeetings(communityId: string) {
    const { data: meetingsData, error: meetingsError } = await supabase
      .from('community_online_meetings')
      .select('*')
      .eq('community_id', communityId)
      .order('scheduled_date', { ascending: true });

    if (meetingsError) throw meetingsError;
    return meetingsData;
  },

  async fetchMeetingStats(communityId: string) {
    const { data: statsData, error: statsError } = await supabase
      .from('community_meeting_stats')
      .select('*')
      .eq('community_id', communityId);

    if (statsError) throw statsError;
    return statsData;
  },

  async createMeeting(meetingData: Omit<OnlineMeeting, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('community_online_meetings')
      .insert([meetingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMeeting(meetingId: string, updates: Partial<OnlineMeeting>) {
    const { data, error } = await supabase
      .from('community_online_meetings')
      .update(updates)
      .eq('id', meetingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMeeting(meetingId: string) {
    const { error } = await supabase
      .from('community_online_meetings')
      .delete()
      .eq('id', meetingId);

    if (error) throw error;
  },

  async recordAttendance(meetingId: string) {
    const { data, error } = await supabase.rpc('record_meeting_attendance', {
      meeting_id_param: meetingId
    });

    if (error) throw error;
    return data as unknown as AttendanceResponse;
  }
};
