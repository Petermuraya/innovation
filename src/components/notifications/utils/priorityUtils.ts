
import { PriorityLevel } from '../types';

export const getPriorityColor = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getPriorityIcon = (priority: PriorityLevel): string => {
  switch (priority) {
    case 'urgent':
      return '🚨';
    case 'high':
      return '⚠️';
    case 'medium':
      return 'ℹ️';
    case 'low':
      return '💡';
    default:
      return '📌';
  }
};
