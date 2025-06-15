
import { supabase } from '@/integrations/supabase/client';

export const fetchAllMembers = async () => {
  try {
    console.log('Fetching members...');
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Members fetch failed:', error);
    return [];
  }
};

export const fetchAllProjects = async () => {
  try {
    console.log('Fetching projects...');
    const { data, error } = await supabase
      .from('project_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Projects fetch failed:', error);
    return [];
  }
};

export const fetchAllEvents = async () => {
  try {
    console.log('Fetching events...');
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      throw error;
    }

    console.log('Events fetched:', data?.length || 0, 'events');
    return data || [];
  } catch (error) {
    console.error('Events fetch failed:', error);
    return [];
  }
};

export const fetchAllPayments = async () => {
  try {
    console.log('Fetching payments...');
    const { data, error } = await supabase
      .from('mpesa_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Payments fetch failed:', error);
    return [];
  }
};

export const fetchAllCertificates = async () => {
  try {
    console.log('Fetching certificates...');
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching certificates:', error);
      throw error;
    }

    console.log('Certificates fetched:', data?.length || 0, 'certificates');
    return data || [];
  } catch (error) {
    console.error('Certificates fetch failed:', error);
    return [];
  }
};

export const fetchAllAdminRequests = async () => {
  try {
    console.log('Fetching admin requests...');
    const { data, error } = await supabase
      .from('admin_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin requests:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Admin requests fetch failed:', error);
    return [];
  }
};
