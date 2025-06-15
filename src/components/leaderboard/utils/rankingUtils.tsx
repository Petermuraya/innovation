
import { Trophy, Medal, Award, TrendingUp, Calendar, Code, FileText, Monitor } from 'lucide-react';
import { EnhancedMemberRank, ActivityBreakdownItem } from '../types/memberRanking';

export const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-amber-600" />;
    case 2:
      return <Medal className="w-5 h-5 text-slate-600" />;
    case 3:
      return <Award className="w-5 h-5 text-orange-600" />;
    default:
      return <TrendingUp className="w-4 h-4 text-blue-600" />;
  }
};

export const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white shadow-lg shadow-amber-200 border-0 hover:shadow-xl transition-all duration-300 animate-pulse-soft';
    case 2:
      return 'bg-gradient-to-r from-slate-300 via-gray-400 to-slate-500 text-white shadow-lg shadow-slate-200 border-0 hover:shadow-xl transition-all duration-300';
    case 3:
      return 'bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600 text-white shadow-lg shadow-orange-200 border-0 hover:shadow-xl transition-all duration-300';
    default:
      return rank <= 10 
        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 border-0 hover:shadow-lg transition-all duration-200'
        : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm border-0 hover:shadow-md transition-all duration-200';
  }
};

export const getActivityBreakdown = (member: EnhancedMemberRank): ActivityBreakdownItem[] => {
  return [
    { label: 'Events', points: member.event_points, count: member.events_attended, icon: Calendar, color: 'from-blue-500 to-blue-600', textColor: 'text-blue-700' },
    { label: 'Projects', points: member.project_points, count: member.projects_created, icon: Code, color: 'from-purple-500 to-purple-600', textColor: 'text-purple-700' },
    { label: 'Blogs', points: member.blog_points, count: member.blogs_written, icon: FileText, color: 'from-orange-500 to-orange-600', textColor: 'text-orange-700' },
    { label: 'Visits', points: member.visit_points, count: member.visit_days, icon: Monitor, color: 'from-green-500 to-green-600', textColor: 'text-green-700' },
  ].filter(item => item.points > 0);
};

export const filterRankings = (rankings: EnhancedMemberRank[], searchTerm: string, filter: string) => {
  return rankings.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && member.total_points > 100) ||
                         (filter === 'new' && member.rank > 30);
    
    return matchesSearch && matchesFilter;
  });
};
