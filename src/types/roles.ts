
// Centralized role type definitions
export type AppRole = 
  | 'member'
  | 'patron' 
  | 'chairperson'
  | 'vice-chairperson'
  | 'treasurer'
  | 'auditor'
  | 'secretary'
  | 'vice-secretary'
  | 'organizing-secretary'
  | 'community-lead-web'
  | 'community-lead-cybersecurity'
  | 'community-lead-mobile'
  | 'community-lead-iot'
  | 'community-lead-ml-ai';

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
  patron: 'Patron',
  chairperson: 'Chairperson',
  'vice-chairperson': 'Vice-Chairperson',
  treasurer: 'Treasurer',
  auditor: 'Auditor',
  secretary: 'Secretary',
  'vice-secretary': 'Vice-Secretary',
  'organizing-secretary': 'Organizing Secretary',
  'community-lead-web': 'Web Development Lead',
  'community-lead-cybersecurity': 'Cybersecurity Lead',
  'community-lead-mobile': 'Mobile Development Lead',
  'community-lead-iot': 'IoT Lead',
  'community-lead-ml-ai': 'ML/AI Lead'
};

export const ROLE_COLORS: Record<AppRole, 'default' | 'destructive' | 'secondary' | 'outline'> = {
  member: 'default',
  patron: 'destructive',
  chairperson: 'destructive',
  'vice-chairperson': 'secondary',
  treasurer: 'secondary',
  auditor: 'outline',
  secretary: 'secondary',
  'vice-secretary': 'outline',
  'organizing-secretary': 'outline',
  'community-lead-web': 'outline',
  'community-lead-cybersecurity': 'outline',
  'community-lead-mobile': 'outline',
  'community-lead-iot': 'outline',
  'community-lead-ml-ai': 'outline'
};

// Permission definitions based on the matrix
export const ROLE_PERMISSIONS: Record<AppRole, string[]> = {
  patron: [
    'view_dashboard',
    'manage_users',
    'approve_registrations',
    'manage_financial_records',
    'manage_payments',
    'create_events',
    'post_announcements',
    'upload_documents',
    'audit_financial_records',
    'manage_community_projects',
    'view_profile',
    'full_system_access'
  ],
  chairperson: [
    'view_dashboard',
    'manage_users',
    'approve_registrations',
    'manage_financial_records',
    'manage_payments',
    'create_events',
    'post_announcements',
    'upload_documents',
    'audit_financial_records',
    'manage_community_projects',
    'view_profile'
  ],
  'vice-chairperson': [
    'view_dashboard',
    'manage_users',
    'approve_registrations',
    'create_events',
    'post_announcements',
    'upload_documents',
    'audit_financial_records',
    'manage_community_projects',
    'view_profile'
  ],
  treasurer: [
    'view_dashboard',
    'manage_financial_records',
    'manage_payments',
    'audit_financial_records',
    'view_profile'
  ],
  auditor: [
    'view_dashboard',
    'view_financial_records',
    'audit_financial_records',
    'view_profile'
  ],
  secretary: [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'upload_documents',
    'manage_community_projects',
    'view_profile'
  ],
  'vice-secretary': [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'upload_documents',
    'manage_community_projects',
    'view_profile'
  ],
  'organizing-secretary': [
    'view_dashboard',
    'create_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  'community-lead-web': [
    'view_dashboard',
    'create_community_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  'community-lead-cybersecurity': [
    'view_dashboard',
    'create_community_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  'community-lead-mobile': [
    'view_dashboard',
    'create_community_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  'community-lead-iot': [
    'view_dashboard',
    'create_community_events',
    'post_announcements',
    'manage_community_projects',
    'view_profile'
  ],
  'community-lead-ml-ai': [
    'view_dashboard',
    'create_community_events',
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
export const hasPermission = (userRoles: AppRole[], permission: string): boolean => {
  return userRoles.some(role => ROLE_PERMISSIONS[role]?.includes(permission) || role === 'patron');
};

export const isHighLevelRole = (role: AppRole): boolean => {
  return ['patron', 'chairperson', 'vice-chairperson'].includes(role);
};

export const canManageUsers = (userRoles: AppRole[]): boolean => {
  return hasPermission(userRoles, 'manage_users');
};

export const canManageFinances = (userRoles: AppRole[]): boolean => {
  return hasPermission(userRoles, 'manage_financial_records');
};
