
import React from 'react';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface WorldClassNotification {
  type: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  icon: React.ReactNode;
  metadata?: Record<string, any>;
}

export interface StandardNotification {
  type: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  icon: React.ReactNode;
}
