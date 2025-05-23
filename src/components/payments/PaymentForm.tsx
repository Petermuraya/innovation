
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PaymentFormProps {
  amount: number;
  paymentType: 'membership' | 'event' | 'other';
  referenceId?: string;
  onSuccess?: () => void;
}

const PaymentForm = ({ amount, paymentType, referenceId, onSuccess }: PaymentFormProps) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (phone: string) => {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Convert to international format
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.length === 9) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please log in to make a payment');
      return;
    }

    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (formattedPhone.length !== 12) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);

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

      // Call edge function to initiate MPESA payment
      const { data, error } = await supabase.functions.invoke('mpesa-payment', {
        body: {
          amount,
          phoneNumber: formattedPhone,
          paymentRequestId: paymentRequest.id,
        },
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast.success('Payment request sent! Please check your phone for the MPESA prompt.');
        setPhoneNumber('');
        onSuccess?.();
      } else {
        toast.error(data.message || 'Payment request failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>MPESA Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (KSh)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            disabled
            className="bg-gray-50"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="0712345678 or 254712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter your Safaricom number to receive the payment prompt
          </p>
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={loading || !phoneNumber}
          className="w-full"
        >
          {loading ? 'Processing...' : `Pay KSh ${amount}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
