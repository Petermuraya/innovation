
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Member } from '../types/members';

interface MemberDeleteDialogProps {
  member: Member | null;
  onClose: () => void;
  onConfirm: (member: Member) => void;
}

const MemberDeleteDialog = ({ member, onClose, onConfirm }: MemberDeleteDialogProps) => {
  if (!member) return null;

  return (
    <AlertDialog open={!!member} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{member.name}</strong>? 
            This action cannot be undone and will permanently remove the member from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(member)}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete Member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MemberDeleteDialog;
