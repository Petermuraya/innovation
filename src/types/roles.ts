
// Centralized role type definitions that match the database schema
// Database roles (what's actually stored in the database)
export type DatabaseRole = 
  | 'member'
  | 'super_admin'
  | 'general_admin'
  | 'community_admin'
  | 'admin';

// Extended app roles (for UI and permissions)
export type AppRole = 
  | DatabaseRole
  | 'events_admin'
  | 'projects_admin'
  | 'finance_admin'
  | 'content_admin'
  | 'technical_admin'
  | 'marketing_admin'
  | 'chairman'
  | 'vice_chairman';

export interface MemberWithRole {
  member_id: string;
  name: string;
  email: string;
  roles: AppRole[];
}

export interface Member {
  id: string;
  email: string;
  name: string;
  roles: AppRole[];
  registration_status: string;
  phone?: string;
  course?: string;
  created_at: string;
}

// Add missing User interface for compatibility
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

// Add missing UserWithRole interface
export interface UserWithRole {
  user_id: string;
  name: string;
  email: string;
  roles: AppRole[];
}

// Helper function to map AppRole to DatabaseRole
export const mapAppRoleToDatabase = (role: AppRole): DatabaseRole => {
  switch (role) {
    case 'super_admin':
      return 'super_admin';
    case 'general_admin':
      return 'general_admin';
    case 'community_admin':
      return 'community_admin';
    case 'admin':
      return 'admin';
    case 'chairman':
    case 'vice_chairman':
    case 'events_admin':
    case 'projects_admin':
    case 'finance_admin':
    case 'content_admin':
    case 'technical_admin':
    case 'marketing_admin':
      return 'admin'; // Map extended roles to 'admin' in database
    default:
      return 'member';
  }
};

// Helper function to convert Member to MemberWithRole
export const convertMemberToMemberWithRole = (member: Member): MemberWithRole => ({
  member_id: member.id,
  name: member.name,
  email: member.email,
  roles: member.roles,
});

export const ROLE_LABELS: Record<AppRole, string> = {
  member: 'Member',
  super_admin: 'Super Admin',
  general_admin: 'General Admin',
  community_admin: 'Community Admin',
  events_admin: 'Events Admin',
  projects_admin: 'Projects Admin',
  finance_admin: 'Finance Admin',
  content_admin: 'Content Admin',
  technical_admin: 'Technical Admin',
  marketing_admin: 'Marketing Admin',
  chairman: 'Chairman',
  vice_chairman: 'Vice Chairman',
  admin: 'Admin'
};

export const ROLE_COLORS: Record<AppRole, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  member: 'default',
  super_admin: 'destructive',
  general_admin: 'secondary',
  community_admin: 'outline',
  events_admin: 'outline',
  projects_admin: 'outline',
  finance_admin: 'outline',
  content_admin: 'outline',
  technical_admin: 'outline',
  marketing_admin: 'outline',
  chairman: 'destructive',
  vice_chairman: 'secondary',
  admin: 'secondary'
};

// Permission definitions based on the database schema
export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  super_admin: [
    'view_dashboard',
    'manage_members',
    'approve_registrations',
    'manage_financial_records',
    'manage_payments',
    'create_events',
    'post_announcements',
    'upload_documents',
    'audit_financial_records',
    'manage_community_projects',
    'view_profile',
    'full_system_access',
    'certificate_upload'
  ],
  chairman: [
    'view_dashboard',
    'manage_members',
    'approve_registrations',
    'manage_financial_records',
    'manage_payments',
    'create_events',
    'post_announcements',
    'upload_documents',
    'audit_financial_records',
    'manage_community_projects',
    'view_profile',
    'certificate_upload'
  ],
  vice_chairman: [
    'view_dashboard',
    'manage_members',
    'approve_registrations',
    'create_events',
    'post_announcements',
    'upload_documents',
    'audit_financial_records',
    'manage_community_projects',
    'view_profile',
    'certificate_upload'
  ],
  general_admin: [
    'view_dashboard',
    'manage_members',
    'approve_registrations',
    'create_events',
    'post_announcements',
    'upload_documents',
    'manage_community_projects',
    'view_profile'
  ],
  admin: [
    'view_dashboard',
    'manage_members',
    'approve_registrations',
    'create_events',
    'post_announcements',
    'upload_documents',
    'manage_community_projects',
    'view_profile'
  ],
  finance_admin: [
    'view_dashboard',
    'manage_financial_records',
    'manage_payments',
    'audit_financial_records',
    'view_profile'
  ],
  community_admin: [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'upload_documents',
    'manage_community_projects',
    'view_profile'
  ],
  events_admin: [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  projects_admin: [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  content_admin: [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'upload_documents',
    'manage_community_projects',
    'view_profile'
  ],
  technical_admin: [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  marketing_admin: [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  member: [
    'view_dashboard',
    'view_announcements',
    'register_events',
    'view_profile'
  ]
};

// Helper functions for permission checking
export const hasPermission = (memberRoles: AppRole[], permission: string): boolean => {
  return memberRoles.some(role => ROLE_PERMISSIONS[role]?.includes(permission) || role === 'super_admin');
};

export const isHighLevelRole = (role: AppRole): boolean => {
  return ['super_admin', 'chairman', 'vice_chairman'].includes(role);
};

export const canManageMembers = (memberRoles: AppRole[]): boolean => {
  return hasPermission(memberRoles, 'manage_members');
};

export const canManageFinances = (memberRoles: AppRole[]): boolean => {
  return hasPermission(memberRoles, 'manage_financial_records');
};
