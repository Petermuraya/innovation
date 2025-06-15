
export interface Member {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  registration_status: string;
  avatar_url?: string;
  bio?: string;
  year_of_study?: string;
  skills?: string[];
  github_username?: string;
  linkedin_url?: string;
  registration_number?: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  membership_expires_at?: string;
  current_academic_year?: number;
  registration_year?: number;
  is_alumni?: boolean;
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
