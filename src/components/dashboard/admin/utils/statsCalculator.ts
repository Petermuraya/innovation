
import { AdminStats } from '../types/adminData';

export const calculateStats = (
  members: any[],
  projects: any[],
  events: any[],
  payments: any[],
  certificates: any[],
  adminRequests: any[]
): AdminStats => {
  const stats = {
    totalMembers: members?.length || 0,
    pendingMembers: members?.filter(m => m.registration_status === 'pending').length || 0,
    totalProjects: projects?.length || 0,
    pendingProjects: projects?.filter(p => p.status === 'pending').length || 0,
    totalEvents: events?.length || 0,
    totalPayments: payments?.length || 0,
    totalCertificates: certificates?.length || 0,
    pendingAdminRequests: adminRequests?.filter(r => r.status === 'pending').length || 0
  };

  console.log('Calculated stats:', stats);
  return stats;
};
