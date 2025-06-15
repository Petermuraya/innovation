
export interface OnlineMeeting {
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
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface MeetingAttendance {
  id: string;
  meeting_id: string;
  user_id: string;
  joined_at: string;
  points_awarded: boolean;
}

export interface MeetingStats {
  meeting_id: string;
  community_id: string;
  title: string;
  scheduled_date: string;
  status: string;
  total_attendees: number;
  points_awarded_count: number;
}
