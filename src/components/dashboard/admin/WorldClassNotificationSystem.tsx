
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WorldClassNotificationTester from '@/components/notifications/WorldClassNotificationTester';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Crown, Zap, Star } from 'lucide-react';

const WorldClassNotificationSystem = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            World-Class Notification System
          </h3>
          <p className="text-gray-600 mt-1">
            The most advanced and beautiful notification system ever created
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <Crown className="w-6 h-6 text-purple-500" />
          <Zap className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <Alert className="border-2 border-gradient-to-r from-blue-200 to-purple-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <Star className="h-5 w-5 text-yellow-500" />
        <AlertDescription className="text-base">
          <strong>Welcome to the future of notifications!</strong> This system features advanced animations, 
          priority-based styling, celebration effects, smart categorization, and world-class user experience. 
          Each notification is crafted to provide maximum impact and engagement.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <WorldClassNotificationTester />
        
        <Card className="border-2 border-gradient-to-r from-green-200 to-blue-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Advanced Features
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Visual Excellence
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Gradient backgrounds</strong> for premium feel</li>
                  <li>• <strong>Smooth animations</strong> with Framer Motion</li>
                  <li>• <strong>Celebration effects</strong> for special notifications</li>
                  <li>• <strong>Hover interactions</strong> with micro-animations</li>
                  <li>• <strong>Priority-based styling</strong> with visual hierarchy</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Smart Features
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Real-time updates</strong> with Supabase</li>
                  <li>• <strong>Auto-expiration</strong> for time-sensitive content</li>
                  <li>• <strong>Metadata support</strong> for rich content</li>
                  <li>• <strong>Action URLs</strong> for interactive notifications</li>
                  <li>• <strong>Bulk operations</strong> for efficiency</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  User Experience
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Four priority levels</strong> (low, medium, high, urgent)</li>
                  <li>• <strong>Nine notification types</strong> with unique icons</li>
                  <li>• <strong>World-class indicators</strong> with special effects</li>
                  <li>• <strong>Responsive design</strong> for all devices</li>
                  <li>• <strong>Accessibility optimized</strong> for everyone</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorldClassNotificationSystem;
