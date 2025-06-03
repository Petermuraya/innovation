
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatPhoneNumber, validatePhoneNumber } from './PaymentValidation';

interface UsePaymentFormProps {
  amount: number;
  paymentType: 'membership' | 'event' | 'other';
  referenceId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const usePaymentForm = ({ 
  amount, 
  paymentType, 
  referenceId, 
  onSuccess, 
  onError 
}: UsePaymentFormProps) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to make a payment');
      return;
    }

    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    const phoneError = validatePhoneNumber(phoneNumber);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    setLoading(true);
    setError('');

    try {
      // Create payment request record
      const { data: paymentRequest, error: paymentError } = await supabase
        .from('payment_requests')
        .insert({
          user_id: user.id,
          amount,
          phone_number: formattedPhone,
          payment_type: paymentType,
          reference_id: referenceId,
        })
        .select()
        .single();

      if (paymentError) {
        throw paymentError;
      }

      console.log('Payment request created:', paymentRequest);

      // Call edge function to initiate MPESA payment
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          amount,
          phoneNumber: formattedPhone,
          paymentRequestId: paymentRequest.id,
        },
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success('Payment request sent! Please check your phone for the MPESA prompt.');
        setPhoneNumber('');
        onSuccess?.();
      } else {
        throw new Error(data.message || 'Payment request failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error.message || 'Failed to initiate payment. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  return {
    phoneNumber,
    setPhoneNumber,
    loading,
    error,
    handlePayment,
    clearError,
  };
};
