
import AttendanceRecordCard from './AttendanceRecordCard';
import AttendanceEmptyState from './AttendanceEmptyState';
import { AttendanceRecord } from './types';

interface AttendanceRecordsListProps {
  records: AttendanceRecord[];
  totalRecords: number;
  isAdmin: boolean;
}

const AttendanceRecordsList = ({ records, totalRecords, isAdmin }: AttendanceRecordsListProps) => {
  if (records.length === 0) {
    return (
      <AttendanceEmptyState 
        hasRecords={totalRecords > 0}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <AttendanceRecordCard key={record.id} record={record} />
      ))}
    </div>
  );
};

export default AttendanceRecordsList;
