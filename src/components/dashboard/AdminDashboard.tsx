
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, GitBranch, CreditCard, FileText, Bell } from 'lucide-react';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingMembers: 0,
    totalEvents: 0,
    pendingProjects: 0,
    totalPayments: 0,
    unreadNotifications: 0
  });

  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      // Fetch members
      const { data: membersData } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      setMembers(membersData || []);

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      setEvents(eventsData || []);

      // Fetch project submissions
      const { data: projectsData } = await supabase
        .from('project_submissions')
        .select('*, members(name)')
        .order('created_at', { ascending: false });
      setProjects(projectsData || []);

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('mpesa_payments')
        .select('*, members(name)')
        .order('created_at', { ascending: false });
      setPayments(paymentsData || []);

      // Calculate stats
      setStats({
        totalMembers: membersData?.length || 0,
        pendingMembers: membersData?.filter(m => m.registration_status === 'pending').length || 0,
        totalEvents: eventsData?.length || 0,
        pendingProjects: projectsData?.filter(p => p.status === 'pending').length || 0,
        totalPayments: paymentsData?.length || 0,
        unreadNotifications: 0 // Will implement later
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const updateMemberStatus = async (memberId: string, status: string) => {
    try {
      await supabase
        .from('members')
        .update({ registration_status: status })
        .eq('id', memberId);
      
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      await supabase
        .from('project_submissions')
        .update({ status })
        .eq('id', projectId);
      
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-kic-gray">Admin Dashboard</h1>
          <p className="text-kic-gray/70">Manage KIC members, events, and activities</p>
        </div>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Total Members</p>
                <p className="text-xl font-bold text-kic-gray">{stats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Pending Members</p>
                <p className="text-xl font-bold text-kic-gray">{stats.pendingMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Total Events</p>
                <p className="text-xl font-bold text-kic-gray">{stats.totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Pending Projects</p>
                <p className="text-xl font-bold text-kic-gray">{stats.pendingProjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Total Payments</p>
                <p className="text-xl font-bold text-kic-gray">{stats.totalPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Notifications</p>
                <p className="text-xl font-bold text-kic-gray">{stats.unreadNotifications}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Member Management</CardTitle>
              <CardDescription>Approve or reject member registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-kic-gray">{member.name}</h4>
                        <p className="text-sm text-kic-gray/70">{member.email}</p>
                        <p className="text-sm text-kic-gray/70">Phone: {member.phone || 'Not provided'}</p>
                        <p className="text-sm text-kic-gray/70">Course: {member.course || 'Not provided'}</p>
                        <p className="text-sm text-kic-gray/70">Registered: {new Date(member.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          member.registration_status === 'approved' ? 'default' : 
                          member.registration_status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {member.registration_status}
                        </Badge>
                        {member.registration_status === 'pending' && (
                          <div className="space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-kic-green-500 hover:bg-kic-green-600"
                              onClick={() => updateMemberStatus(member.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => updateMemberStatus(member.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <p className="text-kic-gray/70">No members found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>Create and manage events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-kic-green-500 hover:bg-kic-green-600">
                  Create New Event
                </Button>
                {events.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-kic-gray">{event.title}</h4>
                        <p className="text-sm text-kic-gray/70">{event.description}</p>
                        <p className="text-sm text-kic-gray/70">📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-kic-gray/70">📍 {event.location}</p>
                        <p className="text-sm text-kic-gray/70">💰 KSh {event.price}</p>
                      </div>
                      <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-kic-gray/70">No events found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>Review and approve project submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-kic-gray">{project.title}</h4>
                        <p className="text-sm text-kic-gray/70">By: {project.members?.name}</p>
                        <p className="text-sm text-kic-gray/70 mt-1">{project.description}</p>
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-kic-green-500 hover:underline"
                        >
                          View on GitHub
                        </a>
                        <div className="flex space-x-2 mt-2">
                          {project.tech_tags?.map((tag: string, index: number) => (
                            <Badge key={index} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          project.status === 'approved' ? 'default' : 
                          project.status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {project.status}
                        </Badge>
                        {project.status === 'pending' && (
                          <div className="space-x-2">
                            <Button 
                              size="sm" 
                              className="bg-kic-green-500 hover:bg-kic-green-600"
                              onClick={() => updateProjectStatus(project.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => updateProjectStatus(project.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-kic-gray/70">No project submissions found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
              <CardDescription>View and manage MPESA payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-kic-gray">KSh {payment.amount}</h4>
                        <p className="text-sm text-kic-gray/70">From: {payment.members?.name}</p>
                        <p className="text-sm text-kic-gray/70">Phone: {payment.phone_number}</p>
                        <p className="text-sm text-kic-gray/70">Type: {payment.payment_type}</p>
                        <p className="text-sm text-kic-gray/70">Transaction: {payment.transaction_id}</p>
                        <p className="text-sm text-kic-gray/70">Date: {new Date(payment.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={
                        payment.status === 'completed' ? 'default' : 
                        payment.status === 'failed' ? 'destructive' : 'secondary'
                      }>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {payments.length === 0 && (
                  <p className="text-kic-gray/70">No payments found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>Certificate Management</CardTitle>
              <CardDescription>Upload and manage member certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-kic-green-500 hover:bg-kic-green-600">
                  Upload Certificate
                </Button>
                <p className="text-kic-gray/70">Certificate management will be implemented soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
