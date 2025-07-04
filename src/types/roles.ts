
// Centralized role type definitions
export type AppRole = 
  | 'member' 
  | 'super_admin' 
  | 'general_admin' 
  | 'community_admin' 
  | 'admin'
  | 'chairman'
  | 'vice_chairman'
  | 'events_admin'
  | 'projects_admin'
  | 'finance_admin'
  | 'content_admin'
  | 'technical_admin'
  | 'marketing_admin';

export interface UserWithRole {
  user_id: string;
  name: string;
  email: string;
  roles: AppRole[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

export const ROLE_LABELS: Record<AppRole, string> = {
  member: 'Member',
  super_admin: 'Super Admin',
  general_admin: 'General Admin',
  community_admin: 'Community Admin',
  admin: 'Admin',
  chairman: 'Chairman',
  vice_chairman: 'Vice Chairman',
  events_admin: 'Events Admin',
  projects_admin: 'Projects Admin',
  finance_admin: 'Finance Admin',
  content_admin: 'Content Admin',
  technical_admin: 'Technical Admin',
  marketing_admin: 'Marketing Admin'
};

export const ROLE_COLORS: Record<AppRole, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  member: 'default',
  super_admin: 'destructive',
  general_admin: 'secondary',
  community_admin: 'outline',
  admin: 'secondary',
  chairman: 'destructive',
  vice_chairman: 'secondary',
  events_admin: 'outline',
  projects_admin: 'outline',
  finance_admin: 'outline',
  content_admin: 'outline',
  technical_admin: 'outline',
  marketing_admin: 'outline'
};
