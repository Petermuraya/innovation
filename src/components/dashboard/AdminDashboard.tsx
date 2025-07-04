import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, FileText, Calendar, Briefcase, Award, Settings, BarChart3, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const { member, memberRole } = useAuth();

  
  const adminSections = [
    {
      title: "Member Management",
      description: "Manage club members, approve registrations, and handle member data",
      icon: Users,
      href: "/dashboard/admin/members",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Event Management", 
      description: "Create, edit, and manage club events and workshops",
      icon: Calendar,
      href: "/dashboard/admin/events",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Content Management",
      description: "Manage blog posts, announcements, and website content",
      icon: FileText,
      href: "/dashboard/admin/blog-management",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Career Opportunities",
      description: "Manage job postings and internship opportunities",
      icon: Briefcase,
      href: "/dashboard/admin/careers",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Certificates",
      description: "Issue and manage member certificates and achievements",
      icon: Award,
      href: "/dashboard/admin/certificates",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Analytics",
      description: "View member engagement, event attendance, and club statistics",
      icon: BarChart3,
      href: "/dashboard/admin/analytics",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Notifications",
      description: "Send announcements and notifications to members",
      icon: Bell,
      href: "/dashboard/admin/notifications",
      color: "bg-pink-50 text-pink-600",
    },
    {
      title: "System Settings",
      description: "Configure system settings and administrative preferences",
      icon: Settings,
      href: "/dashboard/admin/settings",
      color: "bg-gray-50 text-gray-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-kic-gray">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {member?.email}</p>
        </div>
        <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-800">
          <Shield className="w-4 h-4 mr-2" />
          {memberRole || 'Admin'}
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Approved members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Issued this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-gray-600">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href={section.href}>Manage</a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
