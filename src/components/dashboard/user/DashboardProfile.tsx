
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit } from 'lucide-react';
import ProfileEditor from './ProfileEditor';

interface DashboardProfileProps {
  memberData: any;
}

const DashboardProfile = ({ memberData }: DashboardProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = () => {
    setIsEditing(false);
    // Parent component will handle the actual data refresh
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)}
          >
            Back to Profile
          </Button>
        </div>
        <ProfileEditor memberData={memberData} onUpdate={handleUpdate} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={memberData?.avatar_url} />
              <AvatarFallback className="text-lg">
                {memberData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-kic-gray">Name</label>
                  <p className="text-kic-gray/70">{memberData?.name || 'Not provided'}</p>
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
              </div>
              
              {memberData?.bio && (
                <div>
                  <label className="text-sm font-medium text-kic-gray">Bio</label>
                  <p className="text-kic-gray/70 mt-1">{memberData.bio}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-kic-gray">Registration Status</label>
                <div className="mt-1">
                  <Badge variant={memberData?.registration_status === 'approved' ? 'default' : 'secondary'}>
                    {memberData?.registration_status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardProfile;
