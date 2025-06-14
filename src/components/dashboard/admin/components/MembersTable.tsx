
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Member } from '../types/members';
import MemberTableRow from './MemberTableRow';

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
            <MemberTableRow
              key={member.id}
              member={member}
              selectedMember={selectedMember}
              setSelectedMember={setSelectedMember}
              onStatusUpdate={onStatusUpdate}
              onDeleteMember={onDeleteMember}
              isLoading={isLoading}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MembersTable;
