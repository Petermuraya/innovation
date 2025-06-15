
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const RoleManagementAccessDenied = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Access Restricted</h3>
          <p className="text-muted-foreground">Only Super Admins and Chairman can manage roles.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleManagementAccessDenied;
