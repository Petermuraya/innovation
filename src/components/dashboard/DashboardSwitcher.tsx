
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Shield, Users, User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardSwitcher = () => {
  const { memberRole, isAdmin } = useAuth();

  const dashboards = [
    {
      title: 'Member Dashboard',
      description: 'View your profile, activities, and achievements',
      icon: User,
      path: '/dashboard/member',
      color: 'bg-blue-500',
      available: true,
    },
    {
      title: 'Admin Dashboard',
      description: 'Manage users, content, and system settings',
      icon: Shield,
      path: '/dashboard/admin',
      color: 'bg-red-500',
      available: isAdmin,
      badge: memberRole === 'super_admin' ? 'Super Admin' : 'Admin'
    },
    {
      title: 'Community Dashboard',
      description: 'Manage community groups and activities',
      icon: Users,
      path: '/dashboard/community',
      color: 'bg-green-500',
      available: memberRole === 'community_admin' || isAdmin,
    }
  ];

  const availableDashboards = dashboards.filter(dashboard => dashboard.available);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Select Dashboard</h1>
        <p className="text-muted-foreground">
          Choose the dashboard you want to access based on your role
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {availableDashboards.map((dashboard) => {
          const IconComponent = dashboard.icon;
          
          return (
            <Link key={dashboard.path} to={dashboard.path}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${dashboard.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {dashboard.title}
                    {dashboard.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {dashboard.badge}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {dashboard.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Access Dashboard
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {memberRole === 'super_admin' && (
        <div className="text-center">
          <Card className="max-w-md mx-auto border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-700">
                <Crown className="w-5 h-5" />
                <span className="font-medium">Super Admin Access</span>
              </div>
              <p className="text-sm text-yellow-600 mt-1">
                You have full access to all dashboards and system controls
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardSwitcher;
