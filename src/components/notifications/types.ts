
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'payment' | 'approval' | 'announcement' | 'alert' | 'success' | 'info' | 'warning' | 'achievement';
  is_read: boolean;
  created_at: string;
  priority?: PriorityLevel;
  action_url?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

export interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  createNotification: (
    type: string,
    title: string,
    message: string,
    priority?: PriorityLevel,
    metadata?: Record<string, any>
  ) => Promise<void>;
}
