import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dashboard Components
const AdminDashboardHeader = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <div className="flex items-center space-x-4">
      <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
        Refresh Data
      </button>
    </div>
  </div>
);

const AdminDashboardStats = ({ stats }: { stats: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <StatCard title="Total Members" value={stats.totalMembers} />
    <StatCard title="Pending Members" value={stats.pendingMembers} />
    <StatCard title="Total Events" value={stats.totalEvents} />
    <StatCard title="Pending Projects" value={stats.pendingProjects} />
    <StatCard title="Total Payments" value={stats.totalPayments} />
    <StatCard title="Certificates" value={stats.totalCertificates} />
    <StatCard 
      title="Admin Requests" 
      value={stats.pendingAdminRequests} 
      highlight={stats.pendingAdminRequests > 0}
    />
  </div>
);

const StatCard = ({ title, value, highlight = false }: { title: string, value: number, highlight?: boolean }) => (
  <div className={`p-4 rounded-lg shadow ${highlight ? 'bg-red-50 border border-red-200' : 'bg-white'}`}>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-2xl font-bold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
      {value}
    </p>
  </div>
);

// Management Components
const MembersManagement = ({ members, updateMemberStatus }: { members: any[], updateMemberStatus: any }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Members Management</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${member.registration_status === 'approved' ? 'bg-green-100 text-green-800' : 
                    member.registration_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {member.registration_status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {member.registration_status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateMemberStatus(member.id, 'approved')}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateMemberStatus(member.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const EnhancedEventsManagement = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Events Management</h2>
    <p>Events management content goes here</p>
  </div>
);

const ProjectsManagement = ({ projects, updateProjectStatus }: { projects: any[], updateProjectStatus: any }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Projects Management</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{project.members?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${project.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {project.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {project.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => updateProjectStatus(project.id, 'approved')}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => updateProjectStatus(project.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PaymentsManagement = ({ payments }: { payments: any[] }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Payments Management</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="px-6 py-4 whitespace-nowrap">KSh {payment.amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">{payment.members?.name || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(payment.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CertificateManager = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Certificate Manager</h2>
    <p>Certificate management content goes here</p>
  </div>
);

const MPesaConfigManager = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">M-Pesa Configuration</h2>
    <p>M-Pesa configuration content goes here</p>
  </div>
);

const UserManagement = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">User Management</h2>
    <p>User management content goes here</p>
  </div>
);

const CommunityAdminManagement = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Community Admins</h2>
    <p>Community admin management content goes here</p>
  </div>
);

const EnhancedAdminRequestsManagement = () => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Admin Requests</h2>
    <p>Admin requests management content goes here</p>
  </div>
);

// Main Dashboard Component
const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingMembers: 0,
    totalEvents: 0,
    pendingProjects: 0,
    totalPayments: 0,
    totalCertificates: 0,
    pendingAdminRequests: 0
  });

  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

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

      // Fetch certificates count
      const { data: certificatesData } = await supabase
        .from('certificates')
        .select('id');

      // Fetch admin requests count
      const { data: adminRequestsData } = await supabase
        .from('admin_requests')
        .select('id, status')
        .eq('status', 'pending');

      // Calculate stats
      setStats({
        totalMembers: membersData?.length || 0,
        pendingMembers: membersData?.filter((m: any) => m.registration_status === 'pending').length || 0,
        totalEvents: eventsData?.length || 0,
        pendingProjects: projectsData?.filter((p: any) => p.status === 'pending').length || 0,
        totalPayments: paymentsData?.length || 0,
        totalCertificates: certificatesData?.length || 0,
        pendingAdminRequests: adminRequestsData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    }
  };

  const updateMemberStatus = async (memberId: string, status: string) => {
    try {
      await supabase
        .from('members')
        .update({ registration_status: status })
        .eq('id', memberId);
      
      toast({
        title: "Member status updated",
        description: `Registration ${status} successfully.`,
      });
      
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: "Error",
        description: "Failed to update member status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProjectStatus = async (projectId: string, status: string) => {
    try {
      await supabase
        .from('project_submissions')
        .update({ status })
        .eq('id', projectId);
      
      toast({
        title: "Project status updated",
        description: `Project ${status} successfully.`,
      });
      
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating project status:', error);
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <AdminDashboardHeader />
      <AdminDashboardStats stats={stats} />

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="community-admins">Community Admins</TabsTrigger>
          <TabsTrigger value="admin-requests">
            Admin Requests
            {stats.pendingAdminRequests > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {stats.pendingAdminRequests}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersManagement 
            members={members} 
            updateMemberStatus={updateMemberStatus} 
          />
        </TabsContent>

        <TabsContent value="events">
          <EnhancedEventsManagement />
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsManagement 
            projects={projects} 
            updateProjectStatus={updateProjectStatus} 
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsManagement payments={payments} />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificateManager />
        </TabsContent>

        <TabsContent value="mpesa">
          <MPesaConfigManager />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="community-admins">
          <CommunityAdminManagement />
        </TabsContent>

        <TabsContent value="admin-requests">
          <EnhancedAdminRequestsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;