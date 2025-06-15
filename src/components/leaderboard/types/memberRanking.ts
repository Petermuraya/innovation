
export interface EnhancedMemberRank {
  user_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  total_points: number;
  event_points: number;
  project_points: number;
  blog_points: number;
  visit_points: number;
  subscription_points: number;
  events_attended: number;
  projects_created: number;
  blogs_written: number;
  visit_days: number;
  subscriptions_made: number;
  rank: number;
}

export interface MemberRankingProps {
  searchTerm?: string;
  filter?: string;
  timeFilter?: string;
}

export interface ActivityBreakdownItem {
  label: string;
  points: number;
  count: number;
  icon: any;
  color: string;
  textColor: string;
}
