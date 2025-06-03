
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone } from 'lucide-react';
import PaymentFormFields from './PaymentFormFields';
import { usePaymentForm } from './usePaymentForm';

interface PaymentFormProps {
  amount: number;
  paymentType: 'membership' | 'event' | 'other';
  referenceId?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaymentForm = ({ amount, paymentType, referenceId, onSuccess, onError }: PaymentFormProps) => {
  const {
    phoneNumber,
    setPhoneNumber,
    loading,
    error,
    handlePayment,
    clearError,
  } = usePaymentForm({ amount, paymentType, referenceId, onSuccess, onError });

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

        <PaymentFormFields
          amount={amount}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          loading={loading}
          onPhoneChange={clearError}
        />

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
