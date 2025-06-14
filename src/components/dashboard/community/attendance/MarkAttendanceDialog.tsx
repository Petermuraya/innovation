
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle } from 'lucide-react';

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

interface MarkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: CommunityMember[];
  activities: CommunityActivity[];
  onMarkAttendance: (
    activityType: 'activity' | 'event' | 'workshop',
    activityId: string,
    memberAttendance: Record<string, boolean>
  ) => void;
}

const MarkAttendanceDialog = ({ 
  open, 
  onOpenChange, 
  members, 
  activities, 
  onMarkAttendance 
}: MarkAttendanceDialogProps) => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedActivityType, setSelectedActivityType] = useState<'activity' | 'event' | 'workshop'>('activity');
  const [selectedMemberAttendance, setSelectedMemberAttendance] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    onMarkAttendance(selectedActivityType, selectedActivity, selectedMemberAttendance);
    setSelectedActivity('');
    setSelectedActivityType('activity');
    setSelectedMemberAttendance({});
  };

  const toggleMemberAttendance = (userId: string) => {
    setSelectedMemberAttendance(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onClick={handleSubmit}
              disabled={!selectedActivity}
              className="flex-1"
            >
              Save Attendance & Award Points
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAttendanceDialog;
