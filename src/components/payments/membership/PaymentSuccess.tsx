
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentSuccessProps {
  selectedOption: 'registration' | 'subscription' | 'both';
}

const PaymentSuccess = ({ selectedOption }: PaymentSuccessProps) => {
  const getSuccessMessage = () => {
    switch (selectedOption) {
      case 'registration':
        return "Your registration is complete. Consider adding subscription later.";
      case 'subscription':
        return "Your semester subscription is now active.";
      case 'both':
        return "You're fully registered with current semester access.";
      default:
        return "Welcome to KIC!";
    }
  };

  return (
    <motion.div
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
        {getSuccessMessage()}
      </p>
      <Button 
        variant="default" 
        className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600"
        size="lg"
      >
        Access Member Resources
      </Button>
    </motion.div>
  );
};

export default PaymentSuccess;
