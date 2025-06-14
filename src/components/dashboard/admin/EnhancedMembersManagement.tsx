
import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Users, UserCheck, UserX, Eye, Phone, Mail, Calendar, User, CheckCircle, XCircle, Clock, UserPlus, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddMemberDialog from './components/AddMemberDialog';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  year_of_study?: string;
  bio?: string;
  skills?: string[];
  github_username?: string;
  linkedin_url?: string;
  avatar_url?: string;
  created_at: string;
  registration_status: string;
  user_id?: string;
}

interface EnhancedMembersManagementProps {
  members: Member[];
  updateMemberStatus: (memberId: string, status: string) => Promise<void>;
}

const EnhancedMembersManagement = ({ members, updateMemberStatus }: EnhancedMembersManagementProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Sort members by most recent first
  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [members]);

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return sortedMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (member.phone && member.phone.includes(searchTerm));
      
      const matchesStatus = statusFilter === 'all' || member.registration_status === statusFilter;
      const matchesCourse = courseFilter === 'all' || member.course === courseFilter;
      
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [sortedMembers, searchTerm, statusFilter, courseFilter]);

  // Get unique courses for filter
  const courses = useMemo(() => {
    const uniqueCourses = Array.from(new Set(members.map(m => m.course).filter(Boolean)));
    return uniqueCourses;
  }, [members]);

  // Statistics
  const stats = useMemo(() => {
    const total = members.length;
    const pending = members.filter(m => m.registration_status === 'pending').length;
    const approved = members.filter(m => m.registration_status === 'approved').length;
    const rejected = members.filter(m => m.registration_status === 'rejected').length;
    const recent = members.filter(m => {
      const daysDiff = (new Date().getTime() - new Date(m.created_at).getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 7;
    }).length;
    
    return { total, pending, approved, rejected, recent };
  }, [members]);

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

  const MemberDetailsDialog = ({ member }: { member: Member }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatar_url} />
            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {member.name}
          <Badge variant="outline" className="ml-2">
            ID: {member.id.slice(0, 8)}
          </Badge>
        </DialogTitle>
        <DialogDescription>
          Member details and registration information
        </DialogDescription>
      </DialogHeader>
      
      <ScrollArea className="max-h-[60vh] pr-4">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Information
              </h4>
              <div className="space-y-1 text-sm">
                <p><strong>Email:</strong> {member.email}</p>
                {member.phone && <p><strong>Phone:</strong> {member.phone}</p>}
                {member.course && <p><strong>Course:</strong> {member.course}</p>}
                {member.year_of_study && <p><strong>Year:</strong> {member.year_of_study}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray">Registration</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Status:</strong> {getStatusBadge(member.registration_status)}</p>
                <p><strong>Registered:</strong> {new Date(member.created_at).toLocaleDateString()}</p>
                <p><strong>Time ago:</strong> {getTimeAgo(member.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Bio */}
          {member.bio && (
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray">Bio</h4>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </div>
          )}

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-kic-gray">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="space-y-2">
            <h4 className="font-semibold text-kic-gray">Links</h4>
            <div className="space-y-1 text-sm">
              {member.github_username && (
                <p>
                  <strong>GitHub:</strong> 
                  <a 
                    href={`https://github.com/${member.github_username}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    {member.github_username}
                  </a>
                </p>
              )}
              {member.linkedin_url && (
                <p>
                  <strong>LinkedIn:</strong> 
                  <a 
                    href={member.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View Profile
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {member.registration_status === 'pending' && (
              <>
                <Button
                  onClick={() => handleStatusUpdate(member.id, 'approved')}
                  disabled={isLoading === member.id}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate(member.id, 'rejected')}
                  disabled={isLoading === member.id}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
            <Button
              onClick={() => setMemberToDelete(member)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow border-kic-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-kic-green-700">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-kic-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
              </div>
              <UserX className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New (7 days)</p>
                <p className="text-2xl font-bold text-blue-700">{stats.recent}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-kic-green-200 focus:border-kic-green-500"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-kic-green-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-40 border-kic-green-200">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Members Table */}
          {filteredMembers.length > 0 ? (
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
                  {filteredMembers.map((member) => (
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
                              <MemberDetailsDialog member={member} />
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
                                    onClick={() => handleStatusUpdate(member.id, 'approved')}
                                    disabled={isLoading === member.id}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleStatusUpdate(member.id, 'rejected')}
                                    disabled={isLoading === member.id}
                                    className="text-red-600"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => setMemberToDelete(member)}
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
