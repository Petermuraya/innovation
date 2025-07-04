
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Shield, Crown } from 'lucide-react';
import QuickRoleAssignment from './components/QuickRoleAssignment';
import MemberSearchAndFilters from './components/MemberSearchAndFilters';
import MemberList from './components/MemberList';
import AdminRegistrationShare from './components/AdminRegistrationShare';
import { useMemberDeletion } from './hooks/useMemberDeletion';
import { useOptimizedMemberManagement } from './hooks/useOptimizedMemberManagement';
import { AppRole, Member, ROLE_LABELS, ROLE_COLORS, mapAppRoleToDatabase } from '@/types/roles';

const MemberManagement = () => {
  const { toast } = useToast();
  const { isPatron, isChairperson, roleInfo } = useRolePermissions();
  const { members, loading, fetchMembers, removeMemberFromState } = useOptimizedMemberManagement();
  const { deleteMemberCompletely, loading: deletionLoading } = useMemberDeletion();
  
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('general_admin');
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  const grantRole = async (email: string, role: AppRole) => {
    try {
      const member = members.find(m => m.email === email);
      if (!member) {
        toast({
          title: "Error",
          description: "Member not found",
          variant: "destructive",
        });
        return;
      }

      // Map AppRole to database role
      const dbRole = mapAppRoleToDatabase(role);

      // Assign the role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: member.id,
          role: dbRole
        });

      if (roleError) throw roleError;

      // Update member registration status to approved if not already
      if (member.registration_status !== 'approved') {
        const { error: memberError } = await supabase
          .from('members')
          .update({ 
            registration_status: 'approved',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', member.id);

        if (memberError) throw memberError;
      }

      toast({
        title: "Success",
        description: `${ROLE_LABELS[role]} role granted to ${email}`,
      });

      // Force refresh to get latest data
      await fetchMembers(true);
    } catch (error) {
      console.error('Error granting role:', error);
      toast({
        title: "Error",
        description: "Failed to grant role",
        variant: "destructive",
      });
    }
  };

  const removeRole = async (memberId: string, roleToRemove: AppRole) => {
    try {
      // Map AppRole to database role
      const dbRole = mapAppRoleToDatabase(roleToRemove);

      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', memberId)
        .eq('role', dbRole);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${ROLE_LABELS[roleToRemove]} role removed successfully`,
      });

      // Force refresh to get latest data
      await fetchMembers(true);
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    }
  };

  const deleteMember = async (member: Member) => {
    const success = await deleteMemberCompletely(member);
    
    if (success) {
      // Immediately remove from local state
      removeMemberFromState(member.id);
      setMemberToDelete(null);
      
      // Force refresh after a short delay to ensure database consistency
      setTimeout(() => {
        fetchMembers(true);
      }, 1000);
    }
  };

  const canManageMembers = isPatron || isChairperson;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Enhanced Member Management
            {isPatron && <Crown className="w-4 h-4 text-yellow-500" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isPatron && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Super Admin Mode</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Full system access - manage all members, roles, and perform administrative actions.
                </p>
              </div>
            )}

            <MemberSearchAndFilters
              searchEmail={searchEmail}
              onSearchChange={setSearchEmail}
            />
          </div>
        </CardContent>
      </Card>

      {isPatron && <AdminRegistrationShare />}

      {canManageMembers && (
        <QuickRoleAssignment
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
        />
      )}

      <MemberList
        members={members}
        loading={loading || deletionLoading}
        canManageMembers={canManageMembers}
        selectedRole={selectedRole}
        searchEmail={searchEmail}
        onGrantRole={grantRole}
        onRemoveRole={removeRole}
        onEditMember={setMemberToEdit}
        onDeleteMember={setMemberToDelete}
      />

      {/* Delete Member Dialog */}
      <AlertDialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{memberToDelete?.name}</strong>? 
              This action cannot be undone and will remove all member data including:
              <div className="mt-2 space-y-1 text-sm">
                <div>• All assigned roles</div>
                <div>• Member registration data</div>
                <div>• Member profile information</div>
                <div>• All activity history and points</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToDelete && deleteMember(memberToDelete)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletionLoading}
            >
              {deletionLoading ? 'Deleting...' : 'Delete Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Member Dialog */}
      <Dialog open={!!memberToEdit} onOpenChange={(open) => !open && setMemberToEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member: {memberToEdit?.name}</DialogTitle>
            <DialogDescription>
              View and manage member information and roles.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="text-sm">{memberToEdit?.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-sm">{memberToEdit?.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-sm">{memberToEdit?.phone || 'Not provided'}</p>
              </div>
              <div>
                <Label>Course</Label>
                <p className="text-sm">{memberToEdit?.course || 'Not specified'}</p>
              </div>
            </div>
            <div>
              <Label>Current Roles</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {memberToEdit?.roles && memberToEdit.roles.length > 0 ? (
                  memberToEdit.roles.map((role) => (
                    <Badge key={role} variant={ROLE_COLORS[role]}>
                      {ROLE_LABELS[role]}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">Member</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagement;
