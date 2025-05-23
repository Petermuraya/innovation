
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentForm from './PaymentForm';

const MembershipPayment = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const membershipFee = 500; // KSh 500 membership fee

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    // You can add additional logic here like refreshing member status
  };

  if (showPaymentForm) {
    return (
      <PaymentForm
        amount={membershipFee}
        paymentType="membership"
        onSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-kic-primary">KSh {membershipFee}</h3>
          <p className="text-gray-600">Annual Membership Fee</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-semibold">Membership Benefits:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Access to all innovation workshops</li>
            <li>• Priority event registration</li>
            <li>• Networking opportunities</li>
            <li>• Certificate eligibility</li>
            <li>• Project showcase opportunities</li>
          </ul>
        </div>

        <Button 
          onClick={() => setShowPaymentForm(true)}
          className="w-full"
        >
          Pay Membership Fee
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembershipPayment;
