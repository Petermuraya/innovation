
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, FileText, Briefcase, Award, Users, BookOpen, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const { member } = useAuth();

  const userSections = [
    {
      title: "My Profile",
      description: "Update your personal information and preferences",
      icon: User,
      href: "/dashboard/profile",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "My Events",
      description: "View registered events and attendance history",
      icon: Calendar,
      href: "/dashboard/events",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "My Blog Posts",
      description: "Write and manage your blog posts and articles",
      icon: FileText,
      href: "/dashboard/blogging",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Career Opportunities",
      description: "Explore job openings and internship opportunities",
      icon: Briefcase,
      href: "/careers",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "My Certificates",
      description: "View and download your earned certificates",
      icon: Award,
      href: "/dashboard/certificates",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Communities",
      description: "Join specialized innovation communities",
      icon: Users,
      href: "/dashboard/communities",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Constitution",
      description: "View club constitution and governance documents",
      icon: BookOpen,
      href: "/dashboard/constitution",
      color: "bg-teal-50 text-teal-600",
    },
    {
      title: "Payments",
      description: "Manage membership fees and payment history",
      icon: CreditCard,
      href: "/dashboard/payments",
      color: "bg-pink-50 text-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-kic-gray">Member Dashboard</h1>
          <p className="text-gray-600">Welcome back, {member?.email}</p>
        </div>
        <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-800">
          <User className="w-4 h-4 mr-2" />
          Member
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Attended</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">This semester</p>
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
            <p className="text-xs text-muted-foreground">Earned certificates</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Communities</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Joined communities</p>
          </CardContent>
        </Card>
      </div>

      {/* User Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userSections.map((section) => {
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
                  <a href={section.href}>View</a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UserDashboard;
