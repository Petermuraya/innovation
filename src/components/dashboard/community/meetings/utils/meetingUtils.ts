
import { OnlineMeeting } from '../types';
import { DatabaseMeeting } from '../services/meetingsService';

export const transformDatabaseMeeting = (meeting: DatabaseMeeting): OnlineMeeting => ({
  ...meeting,
  status: meeting.status as OnlineMeeting['status']
});

export const transformDatabaseMeetings = (meetings: DatabaseMeeting[]): OnlineMeeting[] => {
  return meetings.map(transformDatabaseMeeting);
};
