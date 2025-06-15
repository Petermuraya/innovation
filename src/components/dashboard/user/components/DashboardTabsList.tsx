
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  FolderOpen, 
  Award, 
  CreditCard, 
  MessageCircle, 
  FileText,
  Users,
  Vote,
  PenTool,
  Briefcase
} from 'lucide-react';

const DashboardTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12 mb-6">
      <TabsTrigger value="overview" className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Overview</span>
      </TabsTrigger>
      <TabsTrigger value="profile" className="flex items-center gap-2">
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Profile</span>
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
      <TabsTrigger value="submissions" className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Submissions</span>
      </TabsTrigger>
      <TabsTrigger value="constitution" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="hidden sm:inline">Constitution</span>
      </TabsTrigger>
      <TabsTrigger value="communities" className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span className="hidden sm:inline">Communities</span>
      </TabsTrigger>
      <TabsTrigger value="elections" className="flex items-center gap-2">
        <Vote className="w-4 h-4" />
        <span className="hidden sm:inline">Elections</span>
      </TabsTrigger>
      <TabsTrigger value="blogging" className="flex items-center gap-2">
        <PenTool className="w-4 h-4" />
        <span className="hidden sm:inline">Blogging</span>
      </TabsTrigger>
      <TabsTrigger value="careers" className="flex items-center gap-2">
        <Briefcase className="w-4 h-4" />
        <span className="hidden sm:inline">Careers</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardTabsList;
