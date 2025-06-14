
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/components/notifications/NotificationProvider';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationsList from '@/components/dashboard/NotificationsList';
import { useState } from 'react';

interface DashboardHeaderProps {
  memberData: any;
  user: any;
}

const DashboardHeader = ({ memberData, user }: DashboardHeaderProps) => {
  const { signOut } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [avatarKey, setAvatarKey] = useState(Date.now());

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage 
            src={memberData?.avatar_url ? `${memberData.avatar_url}?t=${avatarKey}` : undefined}
            key={avatarKey}
          />
          <AvatarFallback className="bg-kic-green-500 text-white">
            {memberData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 
             user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-kic-gray">
            Welcome back, {memberData?.name || user?.email}
          </h1>
          <p className="text-kic-gray/70 text-sm sm:text-base">Manage your KIC membership and activities</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <NotificationsList 
                notifications={notifications.slice(0, 10)} 
                onMarkAllRead={markAllAsRead}
              />
            </div>
          </PopoverContent>
        </Popover>
        
        <Button onClick={signOut} variant="outline" size="sm">
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
