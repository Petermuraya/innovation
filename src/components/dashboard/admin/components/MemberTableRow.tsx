
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Phone, Mail, Calendar } from 'lucide-react';
import { Member } from '../types/members';
import MemberDetailsDialog from './MemberDetailsDialog';
import MemberStatusBadge from './MemberStatusBadge';
import MemberActionsDropdown from './MemberActionsDropdown';
import { getTimeAgo } from './utils/memberTableUtils';

interface MemberTableRowProps {
  member: Member;
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
  onStatusUpdate: (memberId: string, status: string) => Promise<void>;
  onDeleteMember: (member: Member) => void;
  isLoading: string | null;
}

const MemberTableRow = ({
  member,
  selectedMember,
  setSelectedMember,
  onStatusUpdate,
  onDeleteMember,
  isLoading
}: MemberTableRowProps) => {
  return (
    <TableRow className="hover:bg-kic-green-50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatar_url} />
            <AvatarFallback className="bg-kic-green-100 text-kic-green-700">
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-kic-gray">{member.name}</p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail className="h-3 w-3 text-kic-green-600" />
            <span className="truncate max-w-32">{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Phone className="h-3 w-3 text-kic-green-600" />
              <span>{member.phone}</span>
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <div>
          <p className="text-sm">{member.course || 'Not specified'}</p>
          {member.year_of_study && (
            <p className="text-xs text-gray-500">Year {member.year_of_study}</p>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <MemberStatusBadge status={member.registration_status} />
      </TableCell>
      
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="h-3 w-3" />
            {new Date(member.created_at).toLocaleDateString()}
          </div>
          <p className="text-xs text-gray-500">{getTimeAgo(member.created_at)}</p>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedMember(member)}
                className="border-kic-green-200 hover:bg-kic-green-50"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            {selectedMember?.id === member.id && (
              <MemberDetailsDialog 
                member={member}
                onStatusUpdate={onStatusUpdate}
                onDeleteMember={onDeleteMember}
                isLoading={isLoading}
              />
            )}
          </Dialog>
          
          <MemberActionsDropdown
            member={member}
            onStatusUpdate={onStatusUpdate}
            onDeleteMember={onDeleteMember}
            isLoading={isLoading}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MemberTableRow;
