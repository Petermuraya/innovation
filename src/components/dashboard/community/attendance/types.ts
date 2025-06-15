
export interface AttendanceRecord {
  id: string;
  activity_id?: string;
  event_id?: string;
  workshop_id?: string;
  user_id: string;
  attended: boolean;
  attendance_time: string;
  attendance_type: string;
  member_name: string;
  activity_title?: string;
}

export interface CommunityMember {
  user_id: string;
  name: string;
}

export interface CommunityActivity {
  id: string;
  title: string;
  scheduled_date: string;
  type: 'activity' | 'event' | 'workshop';
}

export interface AttendanceStats {
  totalRecords: number;
  totalAttended: number;
  attendanceRate: number;
}
