
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Video, ExternalLink, Trash2 } from 'lucide-react';
import { OnlineMeeting, MeetingStats } from './types';
import { format } from 'date-fns';

interface OnlineMeetingCardProps {
  meeting: OnlineMeeting;
  stats?: MeetingStats;
  isAdmin: boolean;
  onJoinMeeting: (meetingId: string, meetingLink: string) => void;
  onDeleteMeeting?: (meetingId: string) => void;
}

const OnlineMeetingCard = ({ 
  meeting, 
  stats, 
  isAdmin, 
  onJoinMeeting, 
  onDeleteMeeting 
}: OnlineMeetingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isUpcoming = new Date(meeting.scheduled_date) > new Date();
  const isNow = new Date(meeting.scheduled_date) <= new Date() && 
                new Date(meeting.scheduled_date).getTime() + (meeting.duration_minutes * 60000) > new Date().getTime();

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{meeting.title}</CardTitle>
            {meeting.description && (
              <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
            )}
          </div>
          <Badge className={getStatusColor(meeting.status)}>
            {meeting.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(meeting.scheduled_date), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(meeting.scheduled_date), 'HH:mm')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{meeting.duration_minutes}min</span>
          </div>
        </div>

        {stats && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <Users className="h-4 w-4" />
              <span>{stats.total_attendees} attendees</span>
            </div>
            <div className="text-blue-600">
              <span>{stats.points_awarded_count} points awarded</span>
            </div>
          </div>
        )}

        {meeting.max_participants && (
          <div className="text-sm text-gray-600">
            Max participants: {meeting.max_participants}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          {(isUpcoming || isNow) && meeting.status !== 'cancelled' && (
            <Button 
              onClick={() => onJoinMeeting(meeting.id, meeting.meeting_link)}
              className="flex items-center gap-2"
              variant={isNow ? "default" : "outline"}
            >
              <Video className="h-4 w-4" />
              {isNow ? 'Join Now' : 'Join Meeting'}
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}

          {isAdmin && meeting.status === 'scheduled' && onDeleteMeeting && (
            <Button 
              onClick={() => onDeleteMeeting(meeting.id)}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OnlineMeetingCard;
