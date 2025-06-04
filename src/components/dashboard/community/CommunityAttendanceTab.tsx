
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserCheck, Plus, Calendar } from 'lucide-react';

interface CommunityAttendanceTabProps {
  communityId: string;
}

interface AttendanceRecord {
  id: string;
  user_id: string;
  meeting_date: string;
  notes?: string;
  created_at: string;
  members?: {
    name: string;
    email: string;
  };
}

interface CommunityMember {
  user_id: string;
  members?: {
    name: string;
    email: string;
  };
}

const CommunityAttendanceTab = ({ communityId }: CommunityAttendanceTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMarkDialog, setShowMarkDialog] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    user_id: '',
    meeting_date: '',
    notes: '',
  });

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('community_meeting_attendance')
        .select(`
          id,
          user_id,
          meeting_date,
          notes,
          created_at,
          members (
            name,
            email
          )
        `)
        .eq('community_id', communityId)
        .order('meeting_date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Error",
        description: "Failed to load attendance records",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('community_memberships')
        .select(`
          user_id,
          members (
            name,
            email
          )
        `)
        .eq('community_id', communityId)
        .eq('status', 'active');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const markAttendance = async () => {
    if (!attendanceForm.user_id || !attendanceForm.meeting_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_meeting_attendance')
        .insert({
          community_id: communityId,
          user_id: attendanceForm.user_id,
          meeting_date: attendanceForm.meeting_date,
          notes: attendanceForm.notes,
          marked_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Attendance marked successfully",
      });

      setShowMarkDialog(false);
      setAttendanceForm({ user_id: '', meeting_date: '', notes: '' });
      fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAttendance();
    fetchCommunityMembers();
  }, [communityId]);

  if (loading) {
    return <div className="text-center py-8">Loading attendance...</div>;
  }

  // Group attendance by date
  const attendanceByDate = attendance.reduce((acc, record) => {
    const date = record.meeting_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Meeting Attendance
        </CardTitle>
        <Dialog open={showMarkDialog} onOpenChange={setShowMarkDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Meeting Attendance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="member-select">Member *</Label>
                <Select value={attendanceForm.user_id} onValueChange={(value) => 
                  setAttendanceForm(prev => ({ ...prev, user_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.user_id} value={member.user_id}>
                        {member.members?.name} ({member.members?.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="meeting-date">Meeting Date *</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={attendanceForm.meeting_date}
                  onChange={(e) => setAttendanceForm(prev => ({ ...prev, meeting_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={attendanceForm.notes}
                  onChange={(e) => setAttendanceForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMarkDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={markAttendance}>
                  Mark Attendance
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(attendanceByDate).map(([date, records]) => (
            <div key={date} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" />
                <h4 className="font-medium text-kic-gray">
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <Badge variant="secondary">{records.length} attendees</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {records.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{record.members?.name}</span>
                    {record.notes && (
                      <span className="text-xs text-gray-500" title={record.notes}>
                        📝
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(attendanceByDate).length === 0 && (
            <div className="text-center py-8">
              <UserCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Records</h3>
              <p className="text-gray-500">No meeting attendance has been recorded yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityAttendanceTab;
