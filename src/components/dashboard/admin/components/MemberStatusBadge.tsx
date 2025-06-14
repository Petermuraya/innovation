
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface MemberStatusBadgeProps {
  status: string;
}

const MemberStatusBadge = ({ status }: MemberStatusBadgeProps) => {
  switch (status) {
    case 'approved':
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

export default MemberStatusBadge;
