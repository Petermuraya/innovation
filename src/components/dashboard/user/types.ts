
export interface MemberData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  bio?: string;
  registration_status: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface UserStats {
  totalProjects: number;
  eventsAttended: number;
  certificatesEarned: number;
  totalPoints: number;
}

export interface UserDashboardData {
  memberData: MemberData | null;
  stats: UserStats;
  notifications: any[];
  projects: any[];
  certificates: any[];
  upcomingEvents: any[];
  payments: any[];
}
