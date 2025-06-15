
export interface ProjectRank {
  id: string;
  title: string;
  description: string;
  author_name: string;
  github_url: string | null;
  thumbnail_url: string | null;
  tech_tags: string[];
  likes_count: number;
  comments_count: number;
  engagement_score: number;
  status: string;
}

export interface ProjectLeaderboardProps {
  searchTerm?: string;
  filter?: string;
  timeFilter?: string;
}

export type SortBy = 'engagement' | 'likes' | 'recent';

export interface EngagementLevel {
  label: string;
  gradient: string;
  bg: string;
  icon: any;
}
