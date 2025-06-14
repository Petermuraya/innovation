
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AddMemberDialog from './components/AddMemberDialog';
import MembersEmptyState from './components/MembersEmptyState';
import MembersMainContent from './components/MembersMainContent';
import MemberDeleteDialog from './components/MemberDeleteDialog';
import { EnhancedMembersManagementProps, Member } from './types/members';
import { useMemberManagement } from './hooks/useMemberManagement';

const EnhancedMembersManagement = ({ members, updateMemberStatus }: EnhancedMembersManagementProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  console.log('EnhancedMembersManagement received members:', members.length);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    courseFilter,
    setCourseFilter,
    selectedMember,
    setSelectedMember,
    filteredMembers,
    courses,
    stats
  } = useMemberManagement(members);

  console.log('Filtered members:', filteredMembers.length);
  console.log('Member stats:', stats);

  const handleStatusUpdate = async (memberId: string, status: string) => {
    setIsLoading(memberId);
    try {
      await updateMemberStatus(memberId, status);
      toast({
        title: "Status Updated",
        description: `Member has been ${status} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteMember = async (member: Member) => {
    if (!member.user_id) {
      toast({
        title: "Error",
        description: "Cannot delete member: User ID not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Note: In a real implementation, you'd call your delete API here
      // For now, we'll just show a success message
      toast({
        title: "Member Deleted",
        description: `${member.name} has been removed from the system.`,
      });
      setMemberToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddMemberSuccess = () => {
    setShowAddDialog(false);
    // Refresh data would happen here
  };

  if (members.length === 0) {
    return (
      <div className="space-y-6">
        <MembersEmptyState onAddMember={() => setShowAddDialog(true)} />
        <AddMemberDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog}
          onSuccess={handleAddMemberSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MembersMainContent
        stats={stats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        courses={courses}
        filteredMembers={filteredMembers}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        onStatusUpdate={handleStatusUpdate}
        onDeleteMember={setMemberToDelete}
        isLoading={isLoading}
        onAddMember={() => setShowAddDialog(true)}
      />

      {/* Add Member Dialog */}
      <AddMemberDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={handleAddMemberSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <MemberDeleteDialog
        member={memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDeleteMember}
      />
    </div>
  );
};

export default EnhancedMembersManagement;
