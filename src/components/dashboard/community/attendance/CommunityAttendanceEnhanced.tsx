
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { UserCheck } from 'lucide-react';
import AttendanceStats from './AttendanceStats';
import AttendanceSearch from './AttendanceSearch';
import AttendanceRecordsList from './AttendanceRecordsList';
import MarkAttendanceDialog from './MarkAttendanceDialog';
import { useAttendanceData } from './hooks/useAttendanceData';
import { useAttendanceActions } from './hooks/useAttendanceActions';
import { calculateAttendanceStats, filterAttendanceRecords } from './utils/attendanceUtils';

interface CommunityAttendanceEnhancedProps {
  communityId: string;
  isAdmin: boolean;
}

const CommunityAttendanceEnhanced = ({ communityId, isAdmin }: CommunityAttendanceEnhancedProps) => {
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    attendanceRecords,
    members,
    activities,
    loading,
    refetchAttendance,
  } = useAttendanceData(communityId);

  const { handleMarkAttendance } = useAttendanceActions();

  const handleMarkAttendanceSubmit = async (
    activityType: 'activity' | 'event' | 'workshop',
    activityId: string,
    memberAttendance: Record<string, boolean>
  ) => {
    await handleMarkAttendance(
      communityId,
      activityType,
      activityId,
      memberAttendance,
      () => {
        setShowMarkAttendance(false);
        refetchAttendance();
      }
    );
  };

  const filteredRecords = filterAttendanceRecords(attendanceRecords, searchTerm);
  const attendanceStats = calculateAttendanceStats(attendanceRecords);

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
              onMarkAttendance={handleMarkAttendanceSubmit}
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
