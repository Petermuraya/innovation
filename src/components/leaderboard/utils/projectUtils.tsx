
import { Flame, TrendingUp, Zap, Star } from 'lucide-react';
import { EngagementLevel } from '../types/projectLeaderboard';

export const getProjectBadgeColor = (index: number): string => {
  switch (index) {
    case 0:
      return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-200 border-0 hover:shadow-xl transition-all duration-300 animate-pulse-soft';
    case 1:
      return 'bg-gradient-to-r from-slate-300 via-gray-400 to-slate-500 text-white shadow-lg shadow-slate-200 border-0 hover:shadow-xl transition-all duration-300';
    case 2:
      return 'bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-200 border-0 hover:shadow-xl transition-all duration-300';
    default:
      return index < 10 
        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 border-0 hover:shadow-lg transition-all duration-200' 
        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm border-0 hover:shadow-md transition-all duration-200';
  }
};

export const getEngagementLevel = (score: number): EngagementLevel => {
  if (score >= 100) return { 
    label: 'Exceptional', 
    gradient: 'from-emerald-500 to-green-600', 
    bg: 'bg-gradient-to-r from-emerald-100 to-green-100',
    icon: Flame
  };
  if (score >= 50) return { 
    label: 'High', 
    gradient: 'from-blue-500 to-cyan-600', 
    bg: 'bg-gradient-to-r from-blue-100 to-cyan-100',
    icon: TrendingUp
  };
  if (score >= 20) return { 
    label: 'Good', 
    gradient: 'from-amber-500 to-yellow-600', 
    bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
    icon: Zap
  };
  return { 
    label: 'Growing', 
    gradient: 'from-gray-500 to-slate-600', 
    bg: 'bg-gradient-to-r from-gray-100 to-slate-100',
    icon: Star
  };
};

export const filterProjects = (projects: any[], searchTerm: string, filter: string) => {
  return projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tech_tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'featured' && project.engagement_score > 100) ||
                         (filter === 'popular' && project.likes_count > 10);
    
    return matchesSearch && matchesFilter;
  });
};
