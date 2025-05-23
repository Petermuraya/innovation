
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardProfileProps {
  memberData: any;
}

const DashboardProfile = ({ memberData }: DashboardProfileProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-kic-gray">Name</label>
            <p className="text-kic-gray/70">{memberData?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-kic-gray">Email</label>
            <p className="text-kic-gray/70">{memberData?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-kic-gray">Phone</label>
            <p className="text-kic-gray/70">{memberData?.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-kic-gray">Course</label>
            <p className="text-kic-gray/70">{memberData?.course || 'Not provided'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-kic-gray">Registration Status</label>
            <Badge variant={memberData?.registration_status === 'approved' ? 'default' : 'secondary'}>
              {memberData?.registration_status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardProfile;
