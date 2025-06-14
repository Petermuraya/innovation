
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useNotificationCreation } from '../hooks/useNotificationCreation';
import { getPriorityColor } from '../utils/priorityUtils';
import { worldClassNotifications } from '../data/notificationConfigs';

const WorldClassNotificationsSection = () => {
  const { createNotification } = useNotificationCreation();

  return (
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
  );
};

export default WorldClassNotificationsSection;
