
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  UserCog,
  Code2,
  UserCheck,
  Trophy,
  Bell,
  DollarSign,
  BookOpen,
  Briefcase,
  ScrollText,
  Vote
} from 'lucide-react';

interface AdminDashboardTabsProps {
  canManageUsers: boolean;
}

const AdminDashboardTabs = ({ canManageUsers }: AdminDashboardTabsProps) => {
  return (
    <div className="bg-gradient-to-r from-kic-green-50 to-kic-green-100 p-2 sm:p-4 border-b border-kic-green-200 rounded-t-lg">
      <TabsList className={`grid w-full ${canManageUsers ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-15' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-13'} bg-white/80 backdrop-blur-sm border border-kic-green-200 p-1 gap-0.5 sm:gap-1 h-auto`}>
        {canManageUsers && (
          <>
            <TabsTrigger 
              value="user-management" 
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              <UserCog className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Users</span>
            </TabsTrigger>
            <TabsTrigger 
              value="role-management" 
              className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Roles</span>
            </TabsTrigger>
          </>
        )}
        
        <TabsTrigger 
          value="members" 
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
        >
          <Users className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Members</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="community-admins"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
        >
          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Community</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="projects"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
        >
          <Code2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Projects</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="events"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
        >
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Events</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="payments"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
        >
          <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Payments</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="admin-requests"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
        >
          <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Requests</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="certificates"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white"
        >
          <Award className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Certificates</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="leaderboard"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
        >
          <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Leaderboard</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="notifications"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white"
        >
          <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Notifications</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="mpesa-config"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
        >
          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">M-Pesa</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="blogs"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white"
        >
          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Blogs</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="careers"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
        >
          <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Careers</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="constitution"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-700 data-[state=active]:text-white"
        >
          <ScrollText className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Constitution</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="elections"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-700 data-[state=active]:text-white"
        >
          <Vote className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Elections</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="submissions"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
        >
          <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Submissions</span>
        </TabsTrigger>
        
        <TabsTrigger 
          value="analytics"
          className="flex flex-col sm:flex-row items-center gap-1 p-2 sm:p-3 text-xs sm:text-sm transition-all duration-300 hover:scale-105 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
        >
          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline font-medium">Analytics</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};

export default AdminDashboardTabs;
