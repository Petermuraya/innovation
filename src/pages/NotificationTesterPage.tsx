
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Sparkles } from 'lucide-react';
import WorldClassNotificationTester from '@/components/notifications/WorldClassNotificationTester';
import NotificationTester from '@/components/notifications/NotificationTester';

const NotificationTesterPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Perfect Notification System
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Experience the most advanced, real-time notification system with world-class features, 
          instant updates, and beautiful animations.
        </p>
      </div>

      <div className="grid gap-8">
        <WorldClassNotificationTester />
        
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Standard Notification Testing
                </h3>
                <p className="text-sm text-gray-600 font-normal">
                  Test regular notification features and functionality
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <NotificationTester />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-800">
              <Sparkles className="w-6 h-6" />
              Perfect Notification Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800">Real-time Features</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Instant notification delivery</li>
                  <li>• Live read/unread status updates</li>
                  <li>• Real-time notification counts</li>
                  <li>• Automatic UI synchronization</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-800">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• World-class notification animations</li>
                  <li>• Priority-based styling and alerts</li>
                  <li>• Toast notifications for urgent items</li>
                  <li>• Enhanced notification metadata</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationTesterPage;
