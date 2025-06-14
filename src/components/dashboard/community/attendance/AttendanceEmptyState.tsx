
import { UserCheck } from 'lucide-react';

interface AttendanceEmptyStateProps {
  hasRecords: boolean;
  isAdmin: boolean;
}

const AttendanceEmptyState = ({ hasRecords, isAdmin }: AttendanceEmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records</h3>
      <p className="text-gray-500">
        {!hasRecords
          ? (isAdmin ? 'Start marking attendance to see records here.' : 'Attendance records will appear here when they are marked.')
          : 'No records match your search criteria.'
        }
      </p>
    </div>
  );
};

export default AttendanceEmptyState;
