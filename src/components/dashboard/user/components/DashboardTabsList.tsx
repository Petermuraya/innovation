
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
    <div className="w-full mb-6">
      {/* Mobile: Scrollable horizontal tabs */}
      <div className="block lg:hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max">
            <TabsTrigger value="overview" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <User className="w-4 h-4" />
              <span className="text-sm">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <User className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Events</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <FolderOpen className="w-4 h-4" />
              <span className="text-sm">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <Award className="w-4 h-4" />
              <span className="text-sm">Certificates</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">Submissions</span>
            </TabsTrigger>
            <TabsTrigger value="constitution" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <FileText className="w-4 h-4" />
              <span className="text-sm">Constitution</span>
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <Users className="w-4 h-4" />
              <span className="text-sm">Communities</span>
            </TabsTrigger>
            <TabsTrigger value="elections" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <Vote className="w-4 h-4" />
              <span className="text-sm">Elections</span>
            </TabsTrigger>
            <TabsTrigger value="blogging" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <PenTool className="w-4 h-4" />
              <span className="text-sm">Blogging</span>
            </TabsTrigger>
            <TabsTrigger value="careers" className="flex items-center gap-2 px-3 py-2 whitespace-nowrap">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">Careers</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden lg:block">
        <TabsList className="grid w-full grid-cols-12 h-12 bg-muted">
          <TabsTrigger value="overview" className="flex items-center gap-2 px-2">
            <User className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 px-2">
            <User className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2 px-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Events</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2 px-2">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Projects</span>
          </TabsTrigger>
          <TabsTrigger value="certificates" className="flex items-center gap-2 px-2">
            <Award className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Certificates</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2 px-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="submissions" className="flex items-center gap-2 px-2">
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Submissions</span>
          </TabsTrigger>
          <TabsTrigger value="constitution" className="flex items-center gap-2 px-2">
            <FileText className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Constitution</span>
          </TabsTrigger>
          <TabsTrigger value="communities" className="flex items-center gap-2 px-2">
            <Users className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Communities</span>
          </TabsTrigger>
          <TabsTrigger value="elections" className="flex items-center gap-2 px-2">
            <Vote className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Elections</span>
          </TabsTrigger>
          <TabsTrigger value="blogging" className="flex items-center gap-2 px-2">
            <PenTool className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Blogging</span>
          </TabsTrigger>
          <TabsTrigger value="careers" className="flex items-center gap-2 px-2">
            <Briefcase className="w-4 h-4" />
            <span className="hidden xl:inline text-sm">Careers</span>
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
};

export default DashboardTabsList;
