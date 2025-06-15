
import { Bell, AlertTriangle, Info, CheckCircle, Trophy, Star, Calendar, DollarSign } from 'lucide-react';
import { PriorityLevel } from '../types';
import React from 'react';

export interface NotificationConfig {
  type: string;
  title: string;
  message: string;
  priority: PriorityLevel;
  icon: React.ReactElement;
  metadata?: Record<string, any>;
}

export const worldClassNotifications: NotificationConfig[] = [
  {
    type: 'achievement',
    title: 'World-Class Achievement Unlocked! 🏆',
    message: 'Congratulations! You have reached an extraordinary milestone that puts you among the elite innovators. Your dedication and excellence have been recognized at the highest level.',
    priority: 'urgent',
    icon: React.createElement(Trophy, { className: "w-4 h-4 text-yellow-600" }),
    metadata: {
      isWorldClass: true,
      animation: 'celebration',
      sound: 'success'
    }
  },
  {
    type: 'success',
    title: 'Excellence Recognition Award',
    message: 'Your outstanding contribution has been acknowledged by the innovation committee. This world-class performance sets a new standard for excellence.',
    priority: 'high',
    icon: React.createElement(Star, { className: "w-4 h-4 text-purple-600" }),
    metadata: {
      isWorldClass: true,
      animation: 'sparkle',
      sound: 'chime'
    }
  },
  {
    type: 'announcement',
    title: 'Elite Member Status Achieved',
    message: 'Welcome to the exclusive circle of world-class innovators! Your exceptional skills and dedication have earned you this prestigious recognition.',
    priority: 'high',
    icon: React.createElement(CheckCircle, { className: "w-4 h-4 text-green-600" }),
    metadata: {
      isWorldClass: true,
      animation: 'glow',
      special: 'elite'
    }
  }
];

export const standardNotifications: NotificationConfig[] = [
  {
    type: 'event',
    title: 'Upcoming Innovation Workshop',
    message: 'Join us for an exciting workshop on cutting-edge technology. Registration deadline is approaching!',
    priority: 'medium',
    icon: React.createElement(Calendar, { className: "w-4 h-4 text-blue-600" })
  },
  {
    type: 'payment',
    title: 'Payment Reminder',
    message: 'Your membership payment is due soon. Please complete the payment to continue enjoying all benefits.',
    priority: 'high',
    icon: React.createElement(DollarSign, { className: "w-4 h-4 text-green-600" })
  },
  {
    type: 'approval',
    title: 'Project Approved',
    message: 'Great news! Your project submission has been approved and will be featured on our platform.',
    priority: 'medium',
    icon: React.createElement(CheckCircle, { className: "w-4 h-4 text-green-600" })
  },
  {
    type: 'alert',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. Some features may be temporarily unavailable.',
    priority: 'medium',
    icon: React.createElement(AlertTriangle, { className: "w-4 h-4 text-orange-600" })
  },
  {
    type: 'info',
    title: 'New Feature Available',
    message: 'Check out our latest feature updates! Enhanced project collaboration tools are now live.',
    priority: 'low',
    icon: React.createElement(Info, { className: "w-4 h-4 text-blue-600" })
  }
];
