
import { supabase } from '@/integrations/supabase/client';

export const fetchAllMembers = async () => {
  console.log('Fetching members...');
  const { data: membersData, error: membersError } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false });

  if (membersError) {
    console.error('Error fetching members:', membersError);
    return [];
  } else {
    console.log('Members fetched:', membersData?.length || 0, 'members');
    return membersData || [];
  }
};

export const fetchAllProjects = async () => {
  console.log('Fetching projects...');
  const { data: projectsData, error: projectsError } = await supabase
    .from('project_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    return [];
  } else {
    console.log('Projects fetched:', projectsData?.length || 0, 'projects');
    return projectsData || [];
  }
};

export const fetchAllEvents = async () => {
  console.log('Fetching events...');
  const { data: eventsData, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (eventsError) {
    console.error('Error fetching events:', eventsError);
    return [];
  } else {
    console.log('Events fetched:', eventsData?.length || 0, 'events');
    return eventsData || [];
  }
};

export const fetchAllPayments = async () => {
  console.log('Fetching payments with member information...');
  const { data: paymentsData, error: paymentsError } = await supabase
    .from('mpesa_payments')
    .select(`
      *,
      members (
        name,
        email,
        phone,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (paymentsError) {
    console.error('Error fetching payments:', paymentsError);
    return [];
  } else {
    console.log('Payments fetched:', paymentsData?.length || 0, 'payments');
    return paymentsData || [];
  }
};

export const fetchAllCertificates = async () => {
  console.log('Fetching certificates...');
  const { data: certificatesData, error: certificatesError } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (certificatesError) {
    console.error('Error fetching certificates:', certificatesError);
    return [];
  } else {
    console.log('Certificates fetched:', certificatesData?.length || 0, 'certificates');
    return certificatesData || [];
  }
};

export const fetchAllAdminRequests = async () => {
  console.log('Fetching admin requests...');
  const { data: adminRequestsData, error: adminRequestsError } = await supabase
    .from('admin_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (adminRequestsError) {
    console.error('Error fetching admin requests:', adminRequestsError);
    return [];
  }
  
  return adminRequestsData || [];
};

export const fetchPaymentStats = async () => {
  console.log('Fetching payment statistics...');
  try {
    const { data: statsData, error: statsError } = await supabase
      .from('mpesa_payments')
      .select('amount, status, payment_type, created_at');

    if (statsError) {
      console.error('Error fetching payment stats:', statsError);
      return {
        totalRevenue: 0,
        completedPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
        membershipPayments: 0,
        eventPayments: 0
      };
    }

    const payments = statsData || [];
    const completedPayments = payments.filter(p => p.status === 'completed');
    
    const stats = {
      totalRevenue: completedPayments.reduce((sum, p) => sum + Number(p.amount), 0),
      completedPayments: completedPayments.length,
      pendingPayments: payments.filter(p => p.status === 'pending').length,
      failedPayments: payments.filter(p => p.status === 'failed').length,
      membershipPayments: payments.filter(p => p.payment_type === 'membership').length,
      eventPayments: payments.filter(p => p.payment_type === 'event').length
    };

    console.log('Payment stats calculated:', stats);
    return stats;
  } catch (error) {
    console.error('Error calculating payment stats:', error);
    return {
      totalRevenue: 0,
      completedPayments: 0,
      pendingPayments: 0,
      failedPayments: 0,
      membershipPayments: 0,
      eventPayments: 0
    };
  }
};
