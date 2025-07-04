
import { useRolePermissions } from '@/hooks/useRolePermissions';
import RoleAssignmentCard from './components/RoleAssignmentCard';
import UserRolesList from './components/UserRolesList';
import RoleManagementAccessDenied from './components/RoleManagementAccessDenied';
import { useRoleManagement } from './hooks/useRoleManagement';
import { convertUserToUserWithRole } from '@/types/roles';

const RoleManagement = () => {
  const { isPatron, isChairperson } = useRolePermissions();
  
  // Only patrons and chairpersons can manage roles per the permission matrix
  const canManageRoles = isPatron || isChairperson;
  
  const { users, loading, assignRole, removeRole } = useRoleManagement(canManageRoles);

  if (!canManageRoles) {
    return <RoleManagementAccessDenied />;
  }

  // Convert User[] to UserWithRole[] for compatibility
  const usersWithRole = users.map(convertUserToUserWithRole);

  return (
    <div className="space-y-6">
      <RoleAssignmentCard 
        users={usersWithRole}
        loading={loading}
        onAssignRole={assignRole}
      />
      
      <UserRolesList 
        users={usersWithRole}
        loading={loading}
        onRemoveRole={removeRole}
      />
    </div>
  );
};

export default RoleManagement;
