
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Upload } from 'lucide-react';
import CertificateUpload from '@/components/certificates/CertificateUpload';
import { useRolePermissions } from '@/hooks/useRolePermissions';
import RoleGuard from '@/components/security/RoleGuard';

const CertificateManager = () => {
  const { hasPermission } = useRolePermissions();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <RoleGuard requiredPermission="upload_documents">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certificate Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Certificates
                </TabsTrigger>
                <TabsTrigger value="manage" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Manage Certificates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <CertificateUpload onSuccess={handleUploadSuccess} />
              </TabsContent>

              <TabsContent value="manage" className="space-y-4">
                <div className="text-center py-8">
                  <Award className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Certificate Management</h3>
                  <p className="text-muted-foreground">
                    Certificate management features will be available here.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};

export default CertificateManager;
