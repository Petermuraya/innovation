import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CreditCard, Smartphone } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  paymentType: 'membership' | 'event' | 'other';
  referenceId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentForm = ({ amount, paymentType, referenceId, onSuccess, onError }: PaymentFormProps) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const validatePhoneNumber = (phone: string) => {
    const formatted = formatPhoneNumber(phone);
    if (formatted.length !== 12) {
      return 'Please enter a valid Kenyan phone number';
    }
    if (!formatted.startsWith('254')) {
      return 'Phone number must be a Kenyan number';
    }
    return null;
  };

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

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Smartphone className="w-6 h-6 text-green-600" />
          M-PESA Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="amount">Amount (KSh)</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="amount"
              type="number"
              value={amount}
              disabled
              className="bg-gray-50 pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="phone">Safaricom Phone Number</Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="phone"
              type="tel"
              placeholder="0712345678 or 254712345678"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setError('');
              }}
              disabled={loading}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Enter your Safaricom number to receive the payment prompt
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700">
            📱 You will receive an M-PESA prompt on your phone. Please enter your M-PESA PIN to complete the payment.
          </p>
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={loading || !phoneNumber}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {loading ? 'Processing...' : `Pay KSh ${amount} via M-PESA`}
        </Button>

        <p className="text-xs text-center text-gray-500">
          Powered by Safaricom M-PESA • Secure payment processing
        </p>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
