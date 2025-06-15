
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import ProjectsManagement from '../ProjectsManagement';
import EnhancedEventsManagement from '../EnhancedEventsManagement';

const ProjectEventTabs = () => {
  return (
    <>
      <TabsContent value="projects" className="mt-0 animate-fade-in">
        <RoleGuard requirePermission="project_review">
          <ProjectsManagement />
        </RoleGuard>
      </TabsContent>

      <TabsContent value="events" className="mt-0 animate-fade-in">
        <RoleGuard requirePermission="event_manage">
          <EnhancedEventsManagement />
        </RoleGuard>
      </TabsContent>
    </>
  );
};

export default ProjectEventTabs;
