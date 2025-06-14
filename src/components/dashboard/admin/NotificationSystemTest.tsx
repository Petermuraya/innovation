
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationTester from '@/components/notifications/NotificationTester';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const NotificationSystemTest = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Notification System Testing</h3>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Use this tool to test the notification system. The "awold" class notification is a special type 
          with enhanced styling and priority handling. All notifications will appear in the user's notification center.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <NotificationTester />
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Types Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Standard Types:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong>event</strong> - Event notifications</li>
                  <li>• <strong>payment</strong> - Payment-related notifications</li>
                  <li>• <strong>approval</strong> - Approval notifications</li>
                  <li>• <strong>announcement</strong> - General announcements</li>
                  <li>• <strong>alert</strong> - Alert notifications</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Special Types:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong className="text-indigo-600">awold</strong> - Special awold class with enhanced styling</li>
                </ul>
                <h4 className="font-medium mt-4">Priority Levels:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <strong className="text-red-600">high</strong> - High priority (red border)</li>
                  <li>• <strong className="text-yellow-600">medium</strong> - Medium priority (yellow border)</li>
                  <li>• <strong className="text-blue-600">low</strong> - Low priority (blue border)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSystemTest;
