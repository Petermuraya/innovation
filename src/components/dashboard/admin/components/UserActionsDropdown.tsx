
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';

type ComprehensiveRole = 'member' | 'super_admin' | 'general_admin' | 'community_admin' | 'events_admin' | 'projects_admin' | 'finance_admin' | 'content_admin' | 'technical_admin' | 'marketing_admin' | 'chairman' | 'vice_chairman';

interface User {
  id: string;
  email: string;
  name: string;
  roles: ComprehensiveRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

interface UserActionsDropdownProps {
  user: User;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserActionsDropdown = ({ user, onEditUser, onDeleteUser }: UserActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditUser(user)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit User
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDeleteUser(user)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsDropdown;
