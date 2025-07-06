// C:\Users\peter\innovation\src\components\dashboard\user\DashboardSettings.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function DashboardSettings() {
  const { member, updateMember } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: member?.first_name || '',
    lastName: member?.last_name || '',
    email: member?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateMember({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
      });
      toast({
        title: 'Profile updated',
        description: 'Your settings have been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-600">Manage your account settings and preferences</p>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Password</Label>
                <p className="text-sm text-gray-600">
                  Last changed: {member?.last_password_change || 'Never'}
                </p>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600">
                  {member?.two_factor_enabled
                    ? 'Enabled'
                    : 'Not enabled'}
                </p>
                <Button variant="outline">
                  {member?.two_factor_enabled
                    ? 'Disable 2FA'
                    : 'Enable 2FA'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive updates via email
                  </p>
                </div>
                <Button variant="outline">
                  {member?.email_notifications ? 'Disable' : 'Enable'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-gray-600">
                    Receive browser notifications
                  </p>
                </div>
                <Button variant="outline">
                  {member?.push_notifications ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}