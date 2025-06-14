import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AttendanceStats from './AttendanceStats';
import AttendanceSearch from './AttendanceSearch';
import AttendanceRecordsList from './AttendanceRecordsList';
import MarkAttendanceDialog from './MarkAttendanceDialog';

interface AttendanceRecord {
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
  notes?: string;
}

interface CommunityMember {
  user_id: string;
  name: string;
}

interface CommunityActivity {
  id: string;
  title: string;
  scheduled_date: string;
  type: 'activity' | 'event' | 'workshop';
}

interface CommunityAttendanceEnhancedProps {
  communityId: string;
  isAdmin: boolean;
}

const CommunityAttendanceEnhanced = ({ communityId, isAdmin }: CommunityAttendanceEnhancedProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [communityId]);

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

  const fetchAttendanceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('community_attendance_tracking')
        .select(`
          *,
          members!inner(name)
        `)
        .eq('community_id', communityId)
        .order('attendance_time', { ascending: false });

      if (error) throw error;

      const enrichedRecords = (data || []).map((record: any) => ({
        id: record.id,
        activity_id: record.activity_id,
        event_id: record.event_id,
        workshop_id: record.workshop_id,
        user_id: record.user_id,
        attended: record.attended,
        attendance_time: record.attendance_time,
        attendance_type: record.attendance_type,
        member_name: record.members.name,
        activity_title: `${record.attendance_type} - ${record.activity_id || record.event_id || record.workshop_id}`,
        notes: record.notes,
      }));

      setAttendanceRecords(enrichedRecords);
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
      const { data, error } = await supabase
        .from('community_memberships')
        .select(`
          user_id,
          members!inner(name)
        `)
        .eq('community_id', communityId)
        .eq('status', 'active');

      if (error) throw error;

      const membersList = (data || []).map((item: any) => ({
        user_id: item.user_id,
        name: item.members.name,
      }));

      setMembers(membersList);
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

      // Fetch workshops - using start_date instead of scheduled_date
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

  const handleMarkAttendance = async (
    activityType: 'activity' | 'event' | 'workshop',
    activityId: string,
    memberAttendance: Record<string, boolean>
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

      setShowMarkAttendance(false);
      await fetchAttendanceRecords();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.activity_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const attendanceStats = {
    totalRecords: attendanceRecords.length,
    totalAttended: attendanceRecords.filter(r => r.attended).length,
    attendanceRate: attendanceRecords.length > 0 
      ? Math.round((attendanceRecords.filter(r => r.attended).length / attendanceRecords.length) * 100)
      : 0,
  };

  if (loading) {
    return <div className="text-center py-8">Loading attendance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Attendance Tracking</h3>
          <p className="text-sm text-gray-600">Track member attendance for activities and meetings with automatic point awards</p>
        </div>
        {isAdmin && (
          <Dialog open={showMarkAttendance} onOpenChange={setShowMarkAttendance}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <MarkAttendanceDialog
              open={showMarkAttendance}
              onOpenChange={setShowMarkAttendance}
              members={members}
              activities={activities}
              onMarkAttendance={handleMarkAttendance}
            />
          </Dialog>
        )}
      </div>

      <AttendanceStats 
        totalRecords={attendanceStats.totalRecords}
        totalAttended={attendanceStats.totalAttended}
        attendanceRate={attendanceStats.attendanceRate}
      />

      <AttendanceSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <AttendanceRecordsList 
        records={filteredRecords}
        totalRecords={attendanceRecords.length}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default CommunityAttendanceEnhanced;
