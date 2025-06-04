
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, GraduationCap, Edit, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProfileEditor from './ProfileEditor';
import ChangePasswordForm from '@/components/auth/ChangePasswordForm';

interface DashboardProfileProps {
  memberData: any;
}

const DashboardProfile = ({ memberData }: DashboardProfileProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const handleProfileUpdate = () => {
    setShowEditDialog(false);
    // Trigger a refresh of member data if needed
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <ProfileEditor 
                  memberData={memberData} 
                  onUpdate={handleProfileUpdate}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-kic-gray/70" />
                <div>
                  <p className="text-sm text-kic-gray/70">Name</p>
                  <p className="font-medium">{memberData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-kic-gray/70" />
                <div>
                  <p className="text-sm text-kic-gray/70">Email</p>
                  <p className="font-medium">{memberData.email}</p>
                </div>
              </div>
              
              {memberData.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-kic-gray/70" />
                  <div>
                    <p className="text-sm text-kic-gray/70">Phone</p>
                    <p className="font-medium">{memberData.phone}</p>
                  </div>
                </div>
              )}
              
              {memberData.course && (
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-4 w-4 text-kic-gray/70" />
                  <div>
                    <p className="text-sm text-kic-gray/70">Course</p>
                    <p className="font-medium">{memberData.course}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-kic-gray/70">Registration Status</p>
                  <Badge variant={memberData.registration_status === 'approved' ? 'default' : 'secondary'}>
                    {memberData.registration_status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-kic-gray/70">Member Since</p>
                  <p className="text-sm font-medium">
                    {new Date(memberData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Security Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Password</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Keep your account secure with a strong password
                </p>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <ChangePasswordForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Account Security</h4>
                <p className="text-sm text-gray-600">
                  Your account is protected with industry-standard security measures
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600">Account Secure</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bio Section */}
      {memberData.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-kic-gray">{memberData.bio}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardProfile;
