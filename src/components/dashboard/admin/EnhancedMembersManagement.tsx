
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
import { Search, Filter, Users, UserCheck, UserX, Eye, Phone, Mail, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';

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

  // Filter and search logic
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (member.phone && member.phone.includes(searchTerm));
      
      const matchesStatus = statusFilter === 'all' || member.registration_status === statusFilter;
      const matchesCourse = courseFilter === 'all' || member.course === courseFilter;
      
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [members, searchTerm, statusFilter, courseFilter]);

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
    
    return { total, pending, approved, rejected };
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

  const MemberDetailsDialog = ({ member }: { member: Member }) => (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.avatar_url} />
            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {member.name}
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
          {member.registration_status === 'pending' && (
            <div className="flex gap-2 pt-4 border-t">
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
            </div>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
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

        <Card className="hover:shadow-md transition-shadow">
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

        <Card className="hover:shadow-md transition-shadow">
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

        <Card className="hover:shadow-md transition-shadow">
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
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Member Management
          </CardTitle>
          <CardDescription>
            Manage member registrations and view detailed member information
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
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
                <SelectTrigger className="w-40">
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-32">{member.email}</span>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Phone className="h-3 w-3" />
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
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {new Date(member.created_at).toLocaleDateString()}
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
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedMember?.id === member.id && (
                              <MemberDetailsDialog member={member} />
                            )}
                          </Dialog>
                          
                          {member.registration_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStatusUpdate(member.id, 'approved')}
                                disabled={isLoading === member.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusUpdate(member.id, 'rejected')}
                                disabled={isLoading === member.id}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
    </div>
  );
};

export default EnhancedMembersManagement;
