import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Users, Award, Calendar, LayoutGrid, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import PaymentForm from './PaymentForm';

const MembershipPayment = ({ isRegistered = false }: { isRegistered?: boolean }) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'registration' | 'subscription' | 'both'>();
  const { toast } = useToast();

  const paymentOptions = {
    registration: {
      amount: 100,
      label: "Registration Only",
      description: "One-time club registration fee"
    },
    subscription: {
      amount: 100,
      label: "Subscription Only",
      description: "Semester subscription (renewable)"
    },
    both: {
      amount: 200,
      label: "Registration + Subscription",
      description: "Best value - register and get current semester access"
    }
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

  const benefits = [
    { icon: <Zap className="h-5 w-5" />, text: 'Access to innovation workshops' },
    { icon: <Calendar className="h-5 w-5" />, text: 'Event participation' },
    { icon: <Users className="h-5 w-5" />, text: 'Networking opportunities' },
    { icon: <BookOpen className="h-5 w-5" />, text: 'Learning resources' },
    { icon: <LayoutGrid className="h-5 w-5" />, text: 'Project showcase' },
    { icon: <Award className="h-5 w-5" />, text: 'Membership certificate' },
  ];

  if (showPaymentForm && selectedOption) {
    return (
      <PaymentForm
        amount={paymentOptions[selectedOption].amount}
        paymentType={selectedOption}
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
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome to KIC!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedOption === 'registration'
                    ? "Your registration is complete. Consider adding subscription later."
                    : selectedOption === 'subscription'
                      ? "Your semester subscription is now active."
                      : "You're fully registered with current semester access."}
                </p>
                <Button 
                  variant="default" 
                  className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600"
                  size="lg"
                >
                  Access Member Resources
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Payment Options */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">
                    Select Payment Option:
                  </h4>
                  
                  {!isRegistered && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedOption === 'registration' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setSelectedOption('registration')}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">Registration Only</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            One-time club registration
                          </p>
                        </div>
                        <Badge variant="outline" className="text-lg font-mono">
                          KSh 100
                        </Badge>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedOption === 'subscription' 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => setSelectedOption('subscription')}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">Semester Subscription</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Renewable each semester
                        </p>
                      </div>
                      <Badge variant="outline" className="text-lg font-mono">
                        KSh 100
                      </Badge>
                    </div>
                  </motion.div>

                  {!isRegistered && (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedOption === 'both' 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => setSelectedOption('both')}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">Registration + Subscription</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Best value package
                          </p>
                        </div>
                        <Badge variant="default" className="text-lg font-mono">
                          KSh 200
                        </Badge>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Benefits */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-3">Membership Benefits</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <span className="text-blue-500">{benefit.icon}</span>
                        {benefit.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment CTA */}
                <div className="pt-2">
                  <Button 
                    onClick={() => selectedOption && setShowPaymentForm(true)}
                    disabled={!selectedOption}
                    className="w-full py-6 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all"
                    size="lg"
                  >
                    {selectedOption 
                      ? `Pay KSh ${paymentOptions[selectedOption].amount}` 
                      : "Select an option above"}
                  </Button>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                    Secure payment processing. Semester subscriptions auto-expire.
                  </p>
                </div>
              </motion.div>
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