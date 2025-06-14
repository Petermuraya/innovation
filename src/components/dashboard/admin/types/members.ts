
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  year_of_study?: string;
  bio?: string;
  skills?: string[];
  github_username?: string;
  linkedin_url?: string;
  avatar_url?: string;
  created_at: string;
  registration_status: string;
  user_id?: string;
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
