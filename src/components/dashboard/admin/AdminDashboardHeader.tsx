
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Crown, Shield, Star, Users, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import { Card, CardContent } from '@/components/ui/card';

const AdminDashboardHeader = () => {
  const { user, signOut } = useAuth();
  const { roleInfo, isSuperAdmin, isChairman, isViceChairman } = useRolePermissions();
  const [memberData, setMemberData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchMemberData();
      fetchNotifications();
    }
  }, [user]);

  const fetchMemberData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching member data:', error);
        return;
      }

      setMemberData(data);
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getRoleInfo = () => {
    const role = roleInfo?.assignedRole || 'member';
    
    switch (role) {
      case 'super_admin':
        return {
          title: 'Super Administrator',
          icon: Crown,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-800',
          description: 'Full system access and control'
        };
      case 'chairman':
        return {
          title: 'Chairman',
          icon: Crown,
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          description: 'Organization leadership and oversight'
        };
      case 'vice_chairman':
        return {
          title: 'Vice Chairman',
          icon: Star,
          color: 'from-blue-500 to-indigo-500',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          description: 'Deputy leadership and support'
        };
      case 'finance_admin':
        return {
          title: 'Treasurer',
          icon: Wallet,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          description: 'Financial management and oversight'
        };
      case 'general_admin':
        return {
          title: 'Administrator',
          icon: Shield,
          color: 'from-red-500 to-pink-500',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          description: 'Administrative privileges and management'
        };
      default:
        return {
          title: 'Member',
          icon: Users,
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          description: 'Community member'
        };
    }
  };

  const roleInfo_data = getRoleInfo();
  const RoleIcon = roleInfo_data.icon;

  return (
    <div className="animate-fade-in">
      <Card className="bg-gradient-to-r from-white to-kic-green-50 border-0 shadow-lg mb-6 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left Section - User Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div className="relative group">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-kic-green-200 transition-all duration-300 group-hover:ring-kic-green-400 group-hover:scale-105">
                  <AvatarImage src={memberData?.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-kic-green-400 to-kic-green-600 text-white text-xl font-bold">
                    {memberData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 
                     user?.email?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Role Badge on Avatar */}
                <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ${roleInfo_data.bgColor} ring-2 ring-white shadow-lg`}>
                  <RoleIcon className={`w-4 h-4 ${roleInfo_data.textColor}`} />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-kic-gray animate-slide-in-right">
                    Welcome back, {memberData?.name?.split(' ')[0] || user?.email?.split('@')[0]}
                  </h1>
                  <Badge 
                    className={`bg-gradient-to-r ${roleInfo_data.color} text-white px-3 py-1 text-sm font-semibold animate-bounce-gentle w-fit`}
                  >
                    <RoleIcon className="w-4 h-4 mr-1" />
                    {roleInfo_data.title}
                  </Badge>
                </div>
                <p className="text-kic-gray/70 text-sm sm:text-base animate-fade-in" style={{animationDelay: '0.2s'}}>
                  {roleInfo_data.description} • KIC Platform Management
                </p>
                
                {/* Role Permissions Preview */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {roleInfo?.permissions?.slice(0, 3).map((permission, index) => (
                    <Badge 
                      key={permission} 
                      variant="outline" 
                      className="text-xs px-2 py-0.5 animate-scale-in"
                      style={{animationDelay: `${0.3 + index * 0.1}s`}}
                    >
                      {permission.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                  {roleInfo?.permissions && roleInfo.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{roleInfo.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Section - Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="relative group">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative transition-all duration-300 hover:scale-105 hover:shadow-lg border-kic-green-300 hover:border-kic-green-500"
                >
                  <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  {notifications.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs animate-pulse-soft"
                    >
                      {notifications.length > 99 ? '99+' : notifications.length}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <Button 
                onClick={signOut} 
                variant="outline" 
                size="sm"
                className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                Sign Out
              </Button>
            </div>
          </div>
          
          {/* Bottom Stats Bar */}
          <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-kic-green-100 animate-slide-in-right" style={{animationDelay: '0.4s'}}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-kic-green-600">{notifications.length}</p>
                <p className="text-xs text-kic-gray/70">Active Alerts</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-kic-green-600">
                  {roleInfo?.permissions?.length || 0}
                </p>
                <p className="text-xs text-kic-gray/70">Permissions</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-kic-green-600">
                  {new Date().toLocaleDateString()}
                </p>
                <p className="text-xs text-kic-gray/70">Today</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-kic-green-600">Online</p>
                <p className="text-xs text-kic-gray/70">Status</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardHeader;
