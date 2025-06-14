
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNotificationCreation } from '../hooks/useNotificationCreation';
import { getPriorityColor } from '../utils/priorityUtils';
import { standardNotifications } from '../data/notificationConfigs';

const StandardNotificationsSection = () => {
  const { createNotification } = useNotificationCreation();

  return (
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
  );
};

export default StandardNotificationsSection;
