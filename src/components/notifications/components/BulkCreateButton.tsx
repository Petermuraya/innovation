
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useNotificationCreation } from '../hooks/useNotificationCreation';
import { worldClassNotifications, standardNotifications } from '../data/notificationConfigs';

const BulkCreateButton = () => {
  const { createNotification } = useNotificationCreation();

  const handleBulkCreate = () => {
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
  };

  return (
    <div className="pt-4 border-t">
      <Button
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        onClick={handleBulkCreate}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Create All Notifications (World-Class Demo)
      </Button>
    </div>
  );
};

export default BulkCreateButton;
