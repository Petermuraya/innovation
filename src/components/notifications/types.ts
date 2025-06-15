
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string; // Changed from union type to string to match database
  is_read: boolean;
  created_at: string;
  priority?: PriorityLevel;
  action_url?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
  user_id?: string; // Added to match database schema
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

export interface WorldClassNotification {
  type: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  icon: React.ReactElement;
  metadata: {
    isWorldClass: boolean;
    animation: string;
    category: string;
  };
}

export interface StandardNotification {
  type: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  icon: React.ReactElement;
}
