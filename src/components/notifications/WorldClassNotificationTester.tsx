
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import WorldClassNotificationsSection from './components/WorldClassNotificationsSection';
import StandardNotificationsSection from './components/StandardNotificationsSection';
import BulkCreateButton from './components/BulkCreateButton';

const WorldClassNotificationTester = () => {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-gradient-to-r from-purple-200 to-pink-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                World-Class Notification System
              </h3>
              <p className="text-sm text-gray-600 font-normal">
                Experience the most advanced notification system ever created
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <WorldClassNotificationsSection />
          <StandardNotificationsSection />
          <BulkCreateButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorldClassNotificationTester;
