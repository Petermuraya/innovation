
import { AttendanceRecord, AttendanceStats } from '../types';

export const calculateAttendanceStats = (attendanceRecords: AttendanceRecord[]): AttendanceStats => {
  const totalRecords = attendanceRecords.length;
  const totalAttended = attendanceRecords.filter(r => r.attended).length;
  const attendanceRate = totalRecords > 0 
    ? Math.round((totalAttended / totalRecords) * 100)
    : 0;

  return {
    totalRecords,
    totalAttended,
    attendanceRate,
  };
};

export const filterAttendanceRecords = (
  records: AttendanceRecord[],
  searchTerm: string
): AttendanceRecord[] => {
  return records.filter(record =>
    record.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.activity_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};
