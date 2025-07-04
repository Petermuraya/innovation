
import { useRolePermissions } from '@/hooks/useRolePermissions';
import RoleAssignmentCard from './components/RoleAssignmentCard';
import MemberRolesList from './components/MemberRolesList';
import RoleManagementAccessDenied from './components/RoleManagementAccessDenied';
import { useRoleManagement } from './hooks/useRoleManagement';

const RoleManagement = () => {
  const { isPatron, isChairperson } = useRolePermissions();
  
  // Only patrons and chairpersons can manage roles per the permission matrix
  const canManageRoles = isPatron || isChairperson;
  
  const { members, loading, assignRole, removeRole } = useRoleManagement(canManageRoles);

  if (!canManageRoles) {
    return <RoleManagementAccessDenied />;
  }

  // Convert members to include default empty roles array and member_id
  const membersWithRole = members.map(member => ({
    ...member,
    roles: member.roles || [],
    member_id: member.id // Add member_id property expected by MemberWithRole type
  }));

  return (
    <div className="space-y-6">
      <RoleAssignmentCard 
        members={membersWithRole}
        loading={loading}
        onAssignRole={assignRole}
      />
      
      <MemberRolesList 
        members={membersWithRole}
        loading={loading}
        onRemoveRole={removeRole}
      />
    </div>
  );
};

export default RoleManagement;
