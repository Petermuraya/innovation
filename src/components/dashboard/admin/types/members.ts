
export interface Member {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  department?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  github_url?: string;
  github_username?: string;
  portfolio_url?: string;
  skills?: string[];
  interests?: string[];
  year_of_study?: string;
  registration_number?: string;
  current_academic_year?: number;
  registration_year?: number;
  is_alumni?: boolean;
  membership_expires_at?: string;
  registration_status: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MemberStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  recent: number;
}

export interface EnhancedMembersManagementProps {
  members: Member[];
  updateMemberStatus: (memberId: string, status: string) => Promise<void>;
}
