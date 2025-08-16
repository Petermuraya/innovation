import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Shield, Palette, Globe, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const DashboardSettings = () => {
  const { toast } = useToast();
  const { member } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    eventReminders: true,
    blogUpdates: false,
    communityUpdates: true,
    theme: 'system',
    language: 'en',
    timezone: 'Africa/Nairobi',
    twoFactorAuth: false,
    profileVisibility: 'public',
    dataSharing: false,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: "Your preference has been saved",
    });
  };

  const exportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export will be ready shortly",
    });
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        title: "Account Deletion",
        description: "Account deletion request submitted",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSettingChange('emailNotifications', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive browser notifications</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(value) => handleSettingChange('pushNotifications', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Event Reminders</p>
                  <p className="text-sm text-gray-600">Get reminded about upcoming events</p>
                </div>
                <Switch
                  checked={settings.eventReminders}
                  onCheckedChange={(value) => handleSettingChange('eventReminders', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Blog Updates</p>
                  <p className="text-sm text-gray-600">Notifications for new blog posts</p>
                </div>
                <Switch
                  checked={settings.blogUpdates}
                  onCheckedChange={(value) => handleSettingChange('blogUpdates', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Community Updates</p>
                  <p className="text-sm text-gray-600">Updates from your communities</p>
                </div>
                <Switch
                  checked={settings.communityUpdates}
                  onCheckedChange={(value) => handleSettingChange('communityUpdates', value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="font-medium mb-2">Theme</p>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => handleSettingChange('theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="font-medium mb-2">Language</p>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => handleSettingChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="sw">Swahili</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="font-medium mb-2">Timezone</p>
                <Select 
                  value={settings.timezone} 
                  onValueChange={(value) => handleSettingChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Nairobi">Nairobi (EAT)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(value) => handleSettingChange('twoFactorAuth', value)}
                />
              </div>
              
              <div>
                <p className="font-medium mb-2">Profile Visibility</p>
                <Select 
                  value={settings.profileVisibility} 
                  onValueChange={(value) => handleSettingChange('profileVisibility', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members">Members Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Sharing</p>
                  <p className="text-sm text-gray-600">Share anonymous usage data</p>
                </div>
                <Switch
                  checked={settings.dataSharing}
                  onCheckedChange={(value) => handleSettingChange('dataSharing', value)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Manage your personal data and account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={exportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              
              <Separator />
              
              <div className="pt-2">
                <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={deleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardSettings;