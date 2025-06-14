
export interface AdminStats {
  totalMembers: number;
  pendingMembers: number;
  totalProjects: number;
  pendingProjects: number;
  totalEvents: number;
  totalPayments: number;
  totalCertificates: number;
  pendingAdminRequests: number;
}

export interface AdminData {
  stats: AdminStats;
  members: any[];
  events: any[];
  projects: any[];
  payments: any[];
  loading: boolean;
}
