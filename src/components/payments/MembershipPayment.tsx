
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Users, Award, Calendar, LayoutGrid } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { CardHeader } from '@/components/ui/card';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PaymentForm from './PaymentForm';

const MembershipPayment = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const membershipFee = 500; // KSh 500 membership fee

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setPaymentSuccess(true);
    // You can add additional logic here like refreshing member status
  };

  const benefits = [
    { icon: <Zap className="h-5 w-5" />, text: 'Access to all innovation workshops' },
    { icon: <Calendar className="h-5 w-5" />, text: 'Priority event registration' },
    { icon: <Users className="h-5 w-5" />, text: 'Exclusive networking opportunities' },
    { icon: <Award className="h-5 w-5" />, text: 'Certificate of membership' },
    { icon: <LayoutGrid className="h-5 w-5" />, text: 'Project showcase opportunities' },
  ];

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-md border-none shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-full bg-white/20">
              <Award className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">KIC Membership</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {paymentSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-4"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium">Payment Successful!</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Thank you for becoming a KIC member. Your membership benefits are now active.
                </p>
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  Member ID: KIC-{Math.floor(Math.random() * 10000)}
                </Badge>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setPaymentSuccess(false)}
                >
                  View Membership Details
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="inline-flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">KSh {membershipFee}</span>
                    <span className="text-gray-500 dark:text-gray-400">/year</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Annual Membership Fee
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Membership Benefits:
                  </h4>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-0.5 p-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {benefit.icon}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {benefit.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => setShowPaymentForm(true)}
                  className="w-full py-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all"
                  size="lg"
                >
                  Become a Member Now
                </Button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Secure payment processing. Cancel anytime.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MembershipPayment;
