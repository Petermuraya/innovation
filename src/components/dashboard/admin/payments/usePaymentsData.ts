
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Payment {
  id: string;
  amount: number;
  phone_number: string;
  payment_type: string;
  transaction_id: string;
  mpesa_receipt_number: string;
  created_at: string;
  status: string;
  user_id: string;
  checkout_request_id: string;
  merchant_request_id: string;
  result_desc?: string;
  members?: { name: string; email: string } | null;
}

export const usePaymentsData = (initialPayments: Payment[]) => {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mpesa_payments')
        .select(`
          *,
          members!left (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure proper typing
      const transformedData: Payment[] = (data || []).map(payment => {
        // Check if members exists and has the expected structure
        const memberData = payment.members;
        
        // Create a more explicit type guard
        const isValidMemberData = (data: any): data is { name: string; email: string } => {
          return data !== null && 
                 typeof data === 'object' && 
                 typeof data.name === 'string' && 
                 typeof data.email === 'string';
        };
        
        return {
          ...payment,
          members: isValidMemberData(memberData) ? {
            name: memberData.name || 'N/A', 
            email: memberData.email || 'N/A'
          } : null
        };
      });
      
      setPayments(transformedData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return {
    payments,
    loading,
    fetchPayments
  };
};
