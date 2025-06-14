
import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Trophy,
  Star,
  Gift,
  Crown
} from 'lucide-react';
import { WorldClassNotification, StandardNotification } from '../types';

export const worldClassNotifications: WorldClassNotification[] = [
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

export const standardNotifications: StandardNotification[] = [
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
