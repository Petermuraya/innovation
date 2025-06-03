
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone } from 'lucide-react';

interface PaymentFormFieldsProps {
  amount: number;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  loading: boolean;
  onPhoneChange?: () => void;
}

const PaymentFormFields = ({ 
  amount, 
  phoneNumber, 
  setPhoneNumber, 
  loading,
  onPhoneChange 
}: PaymentFormFieldsProps) => {
  return (
    <>
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
              onPhoneChange?.();
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
    </>
  );
};

export default PaymentFormFields;
