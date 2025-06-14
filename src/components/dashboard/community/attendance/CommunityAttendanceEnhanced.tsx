
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck, Users, Calendar, Search, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState<'activity' | 'event' | 'workshop'>('activity');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberAttendance, setSelectedMemberAttendance] = useState<Record<string, boolean>>({});

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

      // Fetch workshops
      const { data: workshopsData, error: workshopsError } = await supabase
        .from('community_workshops')
        .select('id, title, scheduled_date')
        .eq('community_id', communityId)
        .order('scheduled_date', { ascending: false })
        .limit(10);

      if (workshopsError) throw workshopsError;

      // Combine all activities
      const allActivities: CommunityActivity[] = [
        ...(activitiesData || []).map(a => ({ ...a, scheduled_date: a.scheduled_date, type: 'activity' as const })),
        ...(eventsData || []).map(e => ({ 
          id: e.events.id, 
          title: e.events.title, 
          scheduled_date: e.events.date, 
          type: 'event' as const 
        })),
        ...(workshopsData || []).map(w => ({ ...w, scheduled_date: w.scheduled_date, type: 'workshop' as const })),
      ];

      setActivities(allActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedActivity) {
      toast({
        title: "Select Activity",
        description: "Please select an activity to mark attendance for",
        variant: "destructive",
      });
      return;
    }

    try {
      // Mark attendance for each selected member
      const attendancePromises = Object.entries(selectedMemberAttendance).map(([userId, attended]) => {
        if (!attended) return Promise.resolve(); // Skip members not marked as present

        const params = {
          user_id_param: userId,
          community_id_param: communityId,
          attendance_type_param: selectedActivityType,
          marked_by_param: user?.id,
        };

        // Add the appropriate source ID based on attendance type
        if (selectedActivityType === 'activity') {
          params['activity_id_param'] = selectedActivity;
        } else if (selectedActivityType === 'event') {
          params['event_id_param'] = selectedActivity;
        } else if (selectedActivityType === 'workshop') {
          params['workshop_id_param'] = selectedActivity;
        }

        return supabase.rpc('mark_community_attendance', params);
      });

      await Promise.all(attendancePromises);

      toast({
        title: "Attendance marked",
        description: "Attendance has been successfully recorded and points awarded",
      });

      setShowMarkAttendance(false);
      setSelectedActivity('');
      setSelectedActivityType('activity');
      setSelectedMemberAttendance({});
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

  const toggleMemberAttendance = (userId: string) => {
    setSelectedMemberAttendance(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Mark Attendance</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activityType">Activity Type</Label>
                  <Select value={selectedActivityType} onValueChange={(value: 'activity' | 'event' | 'workshop') => {
                    setSelectedActivityType(value);
                    setSelectedActivity('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Activity</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="activity">Select {selectedActivityType}</Label>
                  <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Choose a ${selectedActivityType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {activities
                        .filter(activity => activity.type === selectedActivityType)
                        .map((activity) => (
                          <SelectItem key={activity.id} value={activity.id}>
                            {activity.title} - {new Date(activity.scheduled_date).toLocaleDateString()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedActivity && (
                  <div>
                    <Label>Members Attendance</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-3">
                      {members.map((member) => (
                        <div key={member.user_id} className="flex items-center justify-between p-2 border rounded-md">
                          <span>{member.name}</span>
                          <Button
                            variant={selectedMemberAttendance[member.user_id] ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleMemberAttendance(member.user_id)}
                            className="flex items-center gap-1"
                          >
                            {selectedMemberAttendance[member.user_id] ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Present
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Absent
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleMarkAttendance}
                    disabled={!selectedActivity}
                    className="flex-1"
                  >
                    Save Attendance & Award Points
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowMarkAttendance(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{attendanceStats.totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Attended</p>
                <p className="text-2xl font-bold">{attendanceStats.totalAttended}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold">{attendanceStats.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by member name or activity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Attendance Records */}
      <div className="space-y-3">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {record.attended ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">{record.member_name}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{record.activity_title}</span>
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                      {record.attendance_type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={record.attended ? "default" : "destructive"}>
                    {record.attended ? "Present" : "Absent"}
                  </Badge>
                  
                  <div className="text-sm text-gray-500">
                    {new Date(record.attendance_time).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {record.notes && (
                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>Notes:</strong> {record.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
          <p className="text-gray-500">
            {attendanceRecords.length === 0
              ? (isAdmin ? 'Start marking attendance to see records here.' : 'Attendance records will appear here when they are marked.')
              : 'No records match your search criteria.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityAttendanceEnhanced;
