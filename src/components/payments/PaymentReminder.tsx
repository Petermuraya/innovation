
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, CreditCard, AlertTriangle, Clock } from 'lucide-react';
import { usePaymentReminders } from '@/hooks/usePaymentReminders';
import PaymentForm from './PaymentForm';
import { useToast } from '@/hooks/use-toast';

const PaymentReminder = () => {
  const { reminders, incrementReminder, dismissReminder, loading } = usePaymentReminders();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedReminderType, setSelectedReminderType] = useState<'registration' | 'subscription'>('registration');
  const { toast } = useToast();

  if (loading) {
    return null;
  }

  if (reminders.length === 0) {
    return null;
  }

  const handlePayNow = (reminderType: 'registration' | 'subscription') => {
    setSelectedReminderType(reminderType);
    setShowPaymentForm(true);
    incrementReminder(reminderType);
  };

  const handleDismiss = async (reminderId: string, reminderType: 'registration' | 'subscription') => {
    await dismissReminder(reminderId);
    toast({
      title: "Reminder dismissed",
      description: `${reminderType === 'registration' ? 'Registration' : 'Subscription'} reminder has been dismissed.`,
    });
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed successfully",
    });
  };

  // Map reminder types to payment types that PaymentForm expects
  const getPaymentType = (reminderType: 'registration' | 'subscription'): 'membership' | 'event' | 'other' => {
    // Both registration and subscription payments are membership-related
    return 'membership';
  };

  if (showPaymentForm) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowPaymentForm(false)}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        <PaymentForm
          amount={100}
          paymentType={getPaymentType(selectedReminderType)}
          onSuccess={handlePaymentSuccess}
          onError={(error) => toast({
            title: "Payment Error",
            description: error,
            variant: "destructive"
          })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <Alert key={reminder.id} className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <div className="flex-1">
            <AlertDescription className="text-orange-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium mb-2">
                    {reminder.reminder_type === 'registration' 
                      ? 'Registration Payment Required' 
                      : 'Subscription Payment Due'
                    }
                  </p>
                  <p className="text-sm mb-3">
                    {reminder.reminder_type === 'registration' 
                      ? `Complete your KIC registration by paying KSh 100. This is reminder #${reminder.reminder_count}.`
                      : 'Pay your semester subscription of KSh 100 to access premium features.'
                    }
                  </p>
                  <div className="flex items-center gap-2 text-xs text-orange-600 mb-3">
                    <Clock className="h-3 w-3" />
                    <span>Last reminded: {new Date(reminder.last_reminded_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handlePayNow(reminder.reminder_type)}
                      className="bg-kic-green-500 hover:bg-kic-green-600"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now - KSh 100
                    </Button>
                    {reminder.reminder_type === 'subscription' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDismiss(reminder.id, reminder.reminder_type)}
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Dismiss
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default PaymentReminder;
