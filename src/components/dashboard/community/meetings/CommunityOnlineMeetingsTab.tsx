
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Video, Plus } from 'lucide-react';
import { useOnlineMeetings } from './hooks/useOnlineMeetings';
import OnlineMeetingCard from './OnlineMeetingCard';
import CreateMeetingDialog from './CreateMeetingDialog';

interface CommunityOnlineMeetingsTabProps {
  communityId: string;
  isAdmin: boolean;
}

const CommunityOnlineMeetingsTab = ({ communityId, isAdmin }: CommunityOnlineMeetingsTabProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { 
    meetings, 
    meetingStats, 
    loading, 
    createMeeting, 
    deleteMeeting, 
    recordAttendance 
  } = useOnlineMeetings(communityId);

  const handleJoinMeeting = async (meetingId: string, meetingLink: string) => {
    try {
      // Record attendance first
      await recordAttendance(meetingId);
      
      // Open meeting link in new tab
      window.open(meetingLink, '_blank');
    } catch (error) {
      console.error('Error joining meeting:', error);
      // Still open the meeting link even if attendance recording fails
      window.open(meetingLink, '_blank');
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      await deleteMeeting(meetingId);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading online meetings...</div>;
  }

  const upcomingMeetings = meetings.filter(m => 
    new Date(m.scheduled_date) > new Date() && m.status === 'scheduled'
  );
  const pastMeetings = meetings.filter(m => 
    new Date(m.scheduled_date) <= new Date() || m.status === 'completed'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Online Meetings</h3>
          <p className="text-sm text-gray-600">
            Schedule and join Google Meet sessions with automatic attendance tracking
          </p>
        </div>
        {isAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <CreateMeetingDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
              communityId={communityId}
              onCreateMeeting={createMeeting}
            />
          </Dialog>
        )}
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Online Meetings</h4>
          <p className="text-gray-600 mb-4">
            {isAdmin 
              ? "Schedule your first online meeting to connect with community members."
              : "No online meetings have been scheduled yet."
            }
          </p>
          {isAdmin && (
            <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          {upcomingMeetings.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Upcoming Meetings</h4>
              <div className="grid gap-4">
                {upcomingMeetings.map((meeting) => (
                  <OnlineMeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    stats={meetingStats.find(s => s.meeting_id === meeting.id)}
                    isAdmin={isAdmin}
                    onJoinMeeting={handleJoinMeeting}
                    onDeleteMeeting={isAdmin ? handleDeleteMeeting : undefined}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Meetings */}
          {pastMeetings.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Past Meetings</h4>
              <div className="grid gap-4">
                {pastMeetings.map((meeting) => (
                  <OnlineMeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    stats={meetingStats.find(s => s.meeting_id === meeting.id)}
                    isAdmin={isAdmin}
                    onJoinMeeting={handleJoinMeeting}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityOnlineMeetingsTab;
