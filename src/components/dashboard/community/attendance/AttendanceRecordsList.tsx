
import AttendanceRecordCard from './AttendanceRecordCard';
import AttendanceEmptyState from './AttendanceEmptyState';

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
