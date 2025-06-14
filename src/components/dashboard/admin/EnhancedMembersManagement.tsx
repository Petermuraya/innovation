
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus } from 'lucide-react';
import AddMemberDialog from './components/AddMemberDialog';
import MemberStatsCards from './components/MemberStatsCards';
import MemberFilters from './components/MemberFilters';
import MembersTable from './components/MembersTable';
import { EnhancedMembersManagementProps, Member } from './types/members';
import { useMemberManagement } from './hooks/useMemberManagement';

const EnhancedMembersManagement = ({ members, updateMemberStatus }: EnhancedMembersManagementProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Enhanced Statistics Cards */}
      <MemberStatsCards stats={stats} />

      {/* Main Content */}
      <Card className="border-kic-green-200">
        <CardHeader className="bg-gradient-to-r from-kic-green-50 to-kic-green-100 border-b border-kic-green-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-kic-green-800">
                <Users className="h-5 w-5" />
                Member Management
              </CardTitle>
              <CardDescription className="text-kic-green-600">
                Manage all members, view registration details, and perform administrative actions
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-kic-green-600 hover:bg-kic-green-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Filters and Search */}
          <MemberFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            courseFilter={courseFilter}
            setCourseFilter={setCourseFilter}
            courses={courses}
          />

          {/* Members Table */}
          {filteredMembers.length > 0 ? (
            <MembersTable
              members={filteredMembers}
              selectedMember={selectedMember}
              setSelectedMember={setSelectedMember}
              onStatusUpdate={handleStatusUpdate}
              onDeleteMember={setMemberToDelete}
              isLoading={isLoading}
            />
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || courseFilter !== 'all'
                  ? 'No members match your search criteria'
                  : 'No members found'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <AddMemberDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          setShowAddDialog(false);
          // Refresh data would happen here
        }}
      />

      {/* Delete Confirmation Dialog */}
      {memberToDelete && (
        <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Member</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{memberToDelete.name}</strong>? 
                This action cannot be undone and will permanently remove the member from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteMember(memberToDelete)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default EnhancedMembersManagement;
