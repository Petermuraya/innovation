
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { AttendanceRecord } from './types';

interface AttendanceRecordCardProps {
  record: AttendanceRecord;
}

const AttendanceRecordCard = ({ record }: AttendanceRecordCardProps) => {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {record.attended ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{record.member_name}</span>
            </div>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{record.activity_title}</span>
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                {record.attendance_type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={record.attended ? "default" : "destructive"}>
              {record.attended ? "Present" : "Absent"}
            </Badge>
            
            <div className="text-sm text-gray-500">
              {new Date(record.attendance_time).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceRecordCard;
