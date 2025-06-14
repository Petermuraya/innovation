
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Eye, Phone, Mail, Calendar, CheckCircle, XCircle, Clock, Trash2, MoreHorizontal } from 'lucide-react';
import { Member } from '../types/members';
import MemberDetailsDialog from './MemberDetailsDialog';

interface MembersTableProps {
  members: Member[];
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
  onStatusUpdate: (memberId: string, status: string) => Promise<void>;
  onDeleteMember: (member: Member) => void;
  isLoading: string | null;
}

const MembersTable = ({ 
  members, 
  selectedMember, 
  setSelectedMember, 
  onStatusUpdate, 
  onDeleteMember, 
  isLoading 
}: MembersTableProps) => {
  const getStatusBadge = (status: string) => {
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

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  return (
    <div className="rounded-md border border-kic-green-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-kic-green-50">
            <TableHead className="text-kic-green-800">Member</TableHead>
            <TableHead className="text-kic-green-800">Contact</TableHead>
            <TableHead className="text-kic-green-800">Course</TableHead>
            <TableHead className="text-kic-green-800">Status</TableHead>
            <TableHead className="text-kic-green-800">Registered</TableHead>
            <TableHead className="text-kic-green-800">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id} className="hover:bg-kic-green-50">
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
                {getStatusBadge(member.registration_status)}
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
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-kic-green-200 hover:bg-kic-green-50">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {member.registration_status === 'pending' && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onStatusUpdate(member.id, 'approved')}
                            disabled={isLoading === member.id}
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onStatusUpdate(member.id, 'rejected')}
                            disabled={isLoading === member.id}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => onDeleteMember(member)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
