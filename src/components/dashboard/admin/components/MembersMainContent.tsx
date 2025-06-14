
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import MemberStatsCards from './MemberStatsCards';
import MemberFilters from './MemberFilters';
import MembersTable from './MembersTable';
import { Member, MemberStats } from '../types/members';

interface MembersMainContentProps {
  stats: MemberStats;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  courseFilter: string;
  setCourseFilter: (course: string) => void;
  courses: string[];
  filteredMembers: Member[];
  selectedMember: Member | null;
  setSelectedMember: (member: Member | null) => void;
  onStatusUpdate: (memberId: string, status: string) => Promise<void>;
  onDeleteMember: (member: Member) => void;
  isLoading: string | null;
  onAddMember: () => void;
}

const MembersMainContent = ({
  stats,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  courseFilter,
  setCourseFilter,
  courses,
  filteredMembers,
  selectedMember,
  setSelectedMember,
  onStatusUpdate,
  onDeleteMember,
  isLoading,
  onAddMember
}: MembersMainContentProps) => {
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
              onClick={onAddMember}
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
              onStatusUpdate={onStatusUpdate}
              onDeleteMember={onDeleteMember}
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
    </div>
  );
};

export default MembersMainContent;
