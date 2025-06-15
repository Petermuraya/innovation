
import { createContext, useContext } from 'react';
import { NotificationContextType } from './types';

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a PerfectedNotificationProvider');
  }
  return context;
};
