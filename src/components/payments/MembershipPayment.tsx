
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import PaymentForm from './PaymentForm';
import PaymentSuccess from './membership/PaymentSuccess';
import PaymentOptionsForm from './membership/PaymentOptionsForm';

const MembershipPayment = ({ isRegistered = false }: { isRegistered?: boolean }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'registration' | 'subscription' | 'both'>();
  const { toast } = useToast();

  const paymentOptions = {
    registration: { amount: 100 },
    subscription: { amount: 100 },
    both: { amount: 200 }
  };

  const getPaymentType = (option: 'registration' | 'subscription' | 'both'): 'membership' | 'event' | 'other' => {
    return 'membership';
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setPaymentSuccess(true);
    toast({
      title: "Payment Successful!",
      description: selectedOption === 'registration' 
        ? "You are now registered with KIC" 
        : selectedOption === 'subscription'
          ? "Your semester subscription is active"
          : "You're registered with current semester access",
    });
  };

  if (showPaymentForm && selectedOption) {
    return (
      <PaymentForm
        amount={paymentOptions[selectedOption].amount}
        paymentType={getPaymentType(selectedOption)}
        onSuccess={handlePaymentSuccess}
        onError={(error) => toast({
          title: "Payment Error",
          description: error,
          variant: "destructive"
        })}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <Card className="border-none shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <CardTitle className="flex flex-col gap-2 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/20">
                <Award className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">KIC Membership</span>
            </div>
            <p className="text-sm font-normal opacity-90">
              {isRegistered ? "Renew or upgrade your membership" : "Join our innovation community"}
            </p>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {paymentSuccess ? (
              <PaymentSuccess selectedOption={selectedOption!} />
            ) : (
              <PaymentOptionsForm
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                setShowPaymentForm={setShowPaymentForm}
                isRegistered={isRegistered}
              />
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Karatina Innovation Club - Semester {new Date().getMonth() < 6 ? '1' : '2'} {new Date().getFullYear()}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MembershipPayment;
