
import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle, UserCheck } from 'lucide-react';

interface AttendanceStatsProps {
  totalRecords: number;
  totalAttended: number;
  attendanceRate: number;
}

const AttendanceStats = ({ totalRecords, totalAttended, attendanceRate }: AttendanceStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold">{totalRecords}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Attended</p>
              <p className="text-2xl font-bold">{totalAttended}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <UserCheck className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold">{attendanceRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;
