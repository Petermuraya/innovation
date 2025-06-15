
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FolderOpen, 
  Award, 
  CreditCard, 
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Shield,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import RoleGuard from '@/components/security/RoleGuard';
import MemberManagement from './admin/MemberManagement';
import EventManagement from './admin/EventManagement';
import ProjectsManagement from './admin/ProjectsManagement';
import CertificateManagement from './admin/CertificateManagement';
import PaymentManagement from './admin/PaymentManagement';
import RoleManagement from './admin/RoleManagement';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminBlogManagement from './admin/AdminBlogManagement';
import AdminSubmissionsManagement from './admin/AdminSubmissionsManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { roleInfo, loading } = useRolePermissions();
  const [activeTab, setActiveTab] = useState('members');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      'super_admin': 'Super Admin',
      'general_admin': 'General Admin', 
      'community_admin': 'Community Admin',
      'events_admin': 'Events Admin',
      'projects_admin': 'Projects Admin',
      'finance_admin': 'Finance Admin',
      'content_admin': 'Content Admin',
      'technical_admin': 'Technical Admin',
      'marketing_admin': 'Marketing Admin',
      'chairman': 'Chairman',
      'vice_chairman': 'Vice Chairman'
    };
    return roleNames[role] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
                <p className="text-gray-600">
                  Welcome, {roleInfo?.assignedRole ? getRoleDisplayName(roleInfo.assignedRole) : 'Administrator'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Projects</span>
          </TabsTrigger>
          
          <TabsTrigger value="certificates" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Certificates</span>
          </TabsTrigger>
          
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          
          <TabsTrigger value="blogs" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Blogs</span>
          </TabsTrigger>
          
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Submissions</span>
          </TabsTrigger>
          
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Roles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <RoleGuard requiredRole="general_admin">
            <MemberManagement />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="events">
          <RoleGuard requirePermission="event_manage">
            <EventManagement />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="projects">
          <RoleGuard requirePermission="project_review">
            <ProjectsManagement />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="certificates">
          <RoleGuard requirePermission="certificate_upload">
            <CertificateManagement />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="payments">
          <RoleGuard requirePermission="payment_processing">
            <PaymentManagement />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="blogs">
          <RoleGuard requirePermission="blog_moderation">
            <AdminBlogManagement />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="submissions">
          <RoleGuard requirePermission="content_moderation">
            <AdminSubmissionsManagement />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="analytics">
          <RoleGuard requirePermission="system_analytics">
            <AdminAnalytics />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="roles">
          <RoleGuard requiredRole="super_admin">
            <RoleManagement />
          </RoleGuard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
