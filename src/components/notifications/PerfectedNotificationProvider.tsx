
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationContext } from './NotificationContext';
import { useNotificationManagement } from './hooks/useNotificationManagement';
import { useNotificationRealtime } from './hooks/useNotificationRealtime';
import { NotificationContextType } from './types';

interface PerfectedNotificationProviderProps {
  children: React.ReactNode;
}

export const PerfectedNotificationProvider = ({ children }: PerfectedNotificationProviderProps) => {
  const { user } = useAuth();
  const {
    notifications,
    setNotifications,
    isInitialized,
    setIsInitialized,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
  } = useNotificationManagement();

  // Set up real-time subscription
  useNotificationRealtime({ notifications, setNotifications });

  // Initialize notifications when user changes
  useEffect(() => {
    if (user && !isInitialized) {
      console.log('🚀 Initializing notifications for user:', user.id);
      refreshNotifications();
      setIsInitialized(true);
    } else if (!user) {
      setNotifications([]);
      setIsInitialized(false);
    }
  }, [user, isInitialized, refreshNotifications, setNotifications, setIsInitialized]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    createNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Re-export the hook for convenience
export { useNotifications } from './NotificationContext';
