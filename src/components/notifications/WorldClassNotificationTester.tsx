
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Trophy,
  Zap,
  Star,
  Gift,
  Crown,
  Sparkles
} from 'lucide-react';

type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

interface WorldClassNotification {
  type: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  icon: React.ReactNode;
  metadata?: Record<string, any>;
}

interface StandardNotification {
  type: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  icon: React.ReactNode;
}

const WorldClassNotificationTester = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const createNotification = async (
    type: string, 
    title: string, 
    message: string, 
    priority: PriorityLevel = 'medium',
    metadata?: Record<string, any>
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create notifications",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: type,
          title: title,
          message: message,
          priority: priority,
          metadata: metadata || {},
          is_read: false
        });

      if (error) throw error;

      toast({
        title: "Notification Created",
        description: `${type} notification created successfully`,
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
    }
  };

  const worldClassNotifications: WorldClassNotification[] = [
    {
      type: 'achievement',
      title: '🏆 World-Class Achievement Unlocked!',
      message: 'You have mastered the art of innovation! Your dedication to excellence has earned you the Innovation Champion badge.',
      priority: 'high',
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      metadata: { isWorldClass: true, animation: 'celebration', category: 'achievement' }
    },
    {
      type: 'success',
      title: '✨ Extraordinary Success!',
      message: 'Your project has been featured as the Project of the Month! Congratulations on this outstanding achievement.',
      priority: 'urgent',
      icon: <Star className="w-5 h-5 text-purple-500" />,
      metadata: { isWorldClass: true, animation: 'fireworks', category: 'recognition' }
    },
    {
      type: 'announcement',
      title: '👑 Elite Member Status',
      message: 'Welcome to the elite circle! You have been selected for our exclusive leadership program.',
      priority: 'high',
      icon: <Crown className="w-5 h-5 text-gold" />,
      metadata: { isWorldClass: true, animation: 'royal', category: 'status' }
    },
    {
      type: 'info',
      title: '🎁 Exclusive Opportunity',
      message: 'A special opportunity awaits! You have been invited to our innovation summit as a VIP guest.',
      priority: 'high',
      icon: <Gift className="w-5 h-5 text-green-500" />,
      metadata: { isWorldClass: true, animation: 'sparkle', category: 'opportunity' }
    }
  ];

  const standardNotifications: StandardNotification[] = [
    {
      type: 'event',
      title: 'Weekly Innovation Meeting',
      message: 'Join us for our weekly innovation meeting tomorrow at 2 PM in the main hall.',
      priority: 'medium',
      icon: <Bell className="w-4 h-4" />
    },
    {
      type: 'payment',
      title: 'Payment Confirmation',
      message: 'Your membership payment has been successfully processed. Thank you!',
      priority: 'low',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      type: 'alert',
      title: 'System Maintenance',
      message: 'Scheduled system maintenance will occur tonight from 10 PM to 2 AM.',
      priority: 'medium',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      type: 'info',
      title: 'New Features Available',
      message: 'Check out the latest features we have added to enhance your experience.',
      priority: 'low',
      icon: <Info className="w-4 h-4" />
    }
  ];

  const getPriorityColor = (priority: PriorityLevel): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              World-Class Notifications
            </h4>
            <div className="grid gap-4">
              {worldClassNotifications.map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-2 border-gradient-to-r from-purple-100 to-pink-100 rounded-xl bg-gradient-to-r from-purple-25 to-pink-25 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority} priority
                        </span>
                        <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                          WORLD CLASS
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                    onClick={() => createNotification(
                      notification.type,
                      notification.title,
                      notification.message,
                      notification.priority,
                      notification.metadata
                    )}
                  >
                    Create
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              Standard Notifications
            </h4>
            <div className="grid gap-3">
              {standardNotifications.map((notification, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gray-100 rounded-md">
                      {notification.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${getPriorityColor(notification.priority)}`}>
                        {notification.priority} priority
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => createNotification(
                      notification.type,
                      notification.title,
                      notification.message,
                      notification.priority
                    )}
                  >
                    Create
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
              onClick={() => {
                [...worldClassNotifications, ...standardNotifications].forEach((notification, index) => {
                  setTimeout(() => {
                    createNotification(
                      notification.type,
                      notification.title,
                      notification.message,
                      notification.priority,
                      'metadata' in notification ? notification.metadata : undefined
                    );
                  }, index * 1000);
                });
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create All Notifications (World-Class Demo)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorldClassNotificationTester;
