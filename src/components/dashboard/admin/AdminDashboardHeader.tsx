
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboardHeader = () => {
  const { user, signOut } = useAuth();
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

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={memberData?.avatar_url} />
          <AvatarFallback className="bg-kic-green-500 text-white">
            {memberData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 
             user?.email?.charAt(0).toUpperCase() || 'A'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-kic-gray">
            Welcome back, {memberData?.name || user?.email}
          </h1>
          <p className="text-kic-gray/70 text-sm sm:text-base">Admin Dashboard - Manage KIC platform</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <Bell className="w-5 h-5 text-kic-gray" />
          {notifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              {notifications.length}
            </Badge>
          )}
        </div>
        <Button onClick={signOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
