
import { TabsContent } from '@/components/ui/tabs';
import RoleGuard from '@/components/security/RoleGuard';
import CertificateManager from '../CertificateManager';
import BlogManagement from '../BlogManagement';
import CareerManagement from '../CareerManagement';
import SubmissionsManagement from '../SubmissionsManagement';

const ContentManagementTabs = () => {
  return (
    <>
      <TabsContent value="certificates" className="mt-0 animate-fade-in">
        <RoleGuard requiredPermission="certificate_upload">
          <CertificateManager />
        </RoleGuard>
      </TabsContent>

      <TabsContent value="blogs" className="mt-0 animate-fade-in">
        <RoleGuard requiredPermission="upload_documents">
          <BlogManagement />
        </RoleGuard>
      </TabsContent>

      <TabsContent value="careers" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <CareerManagement />
        </RoleGuard>
      </TabsContent>

      <TabsContent value="submissions" className="mt-0 animate-fade-in">
        <RoleGuard requiredRole="general_admin">
          <SubmissionsManagement />
        </RoleGuard>
      </TabsContent>
    </>
  );
};

export default ContentManagementTabs;
