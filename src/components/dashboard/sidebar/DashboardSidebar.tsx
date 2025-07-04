
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Calendar,
  FileText,
  Briefcase,
  Award,
  Users,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  Home,
  Bell,
  BarChart3,
  Zap,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Logo from '@/assets/Innovation Club New Logo- Primary Logo.png';

interface SidebarItem {
  title: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: string;
  description?: string;
}

const DashboardSidebar = () => {
  const { member, signOut } = useAuth();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isCollapsed = state === 'collapsed';

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const mainItems: SidebarItem[] = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      description: 'Overview and quick stats'
    },
    {
      title: 'My Profile',
      icon: User,
      href: '/dashboard/profile',
      description: 'Personal information'
    },
    {
      title: 'Events',
      icon: Calendar,
      href: '/events',
      badge: 'New',
      description: 'Upcoming events'
    },
    {
      title: 'Blog Posts',
      icon: FileText,
      href: '/blog',
      description: 'Read latest articles'
    },
    {
      title: 'Communities',
      icon: Users,
      href: '/dashboard/communities',
      description: 'Join innovation groups'
    },
  ];

  const resourceItems: SidebarItem[] = [
    {
      title: 'Certificates',
      icon: Award,
      href: '/dashboard/certificates',
      description: 'Earned achievements'
    },
    {
      title: 'Constitution',
      icon: BookOpen,
      href: '/constitution',
      description: 'Club governance'
    },
    {
      title: 'Projects',
      icon: Briefcase,
      href: '/projects',
      description: 'Innovation projects'
    },
    {
      title: 'Payments',
      icon: CreditCard,
      href: '/payments',
      description: 'Membership fees'
    },
  ];

  const utilityItems: SidebarItem[] = [
    {
      title: 'Notifications',
      icon: Bell,
      href: '/dashboard/notifications',
      badge: '3',
      description: 'Recent updates'
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/dashboard/analytics',
      description: 'Your activity stats'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/dashboard/settings',
      description: 'Account preferences'
    },
  ];

  const SidebarItemComponent = ({ item }: { item: SidebarItem }) => {
    const Icon = item.icon;
    
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="group">
          <NavLink
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-kic-green-100 text-kic-green-700 border-l-4 border-kic-green-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center justify-between flex-1 min-w-0"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate">{item.title}</span>
                    {item.description && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <img src={Logo} alt="KIC" className="h-8 w-8 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0"
              >
                <h2 className="font-bold text-lg text-gray-900 truncate">
                  Innovation Club
                </h2>
                <p className="text-xs text-gray-500 truncate">Member Dashboard</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {!isCollapsed ? 'Main Menu' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarItemComponent key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {!isCollapsed ? 'Resources' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {resourceItems.map((item) => (
                <SidebarItemComponent key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {!isCollapsed ? 'Tools' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {utilityItems.map((item) => (
                <SidebarItemComponent key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src="" />
            <AvatarFallback className="bg-kic-green-100 text-kic-green-700 font-semibold">
              {member?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="font-medium text-gray-900 truncate">
                  {member?.email?.split('@')[0] || 'Member'}
                </p>
                <p className="text-xs text-gray-500 truncate">{member?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <Button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3"
              >
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
