
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PaymentOptionCard from './PaymentOptionCard';
import MembershipBenefits from './MembershipBenefits';

interface PaymentOptionsFormProps {
  selectedOption: 'registration' | 'subscription' | 'both' | undefined;
  setSelectedOption: (option: 'registration' | 'subscription' | 'both') => void;
  setShowPaymentForm: (show: boolean) => void;
  isRegistered: boolean;
}

const PaymentOptionsForm = ({ 
  selectedOption, 
  setSelectedOption, 
  setShowPaymentForm, 
  isRegistered 
}: PaymentOptionsFormProps) => {
  const paymentOptions = {
    registration: {
      amount: 100,
      label: "Registration Only",
      description: "One-time club registration"
    },
    subscription: {
      amount: 100,
      label: "Semester Subscription",
      description: "Renewable each semester"
    },
    both: {
      amount: 200,
      label: "Registration + Subscription",
      description: "Best value package"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300">
          Select Payment Option:
        </h4>
        
        {!isRegistered && (
          <PaymentOptionCard
            option="registration"
            amount={paymentOptions.registration.amount}
            label={paymentOptions.registration.label}
            description={paymentOptions.registration.description}
            selected={selectedOption === 'registration'}
            onSelect={() => setSelectedOption('registration')}
          />
        )}

        <PaymentOptionCard
          option="subscription"
          amount={paymentOptions.subscription.amount}
          label={paymentOptions.subscription.label}
          description={paymentOptions.subscription.description}
          selected={selectedOption === 'subscription'}
          onSelect={() => setSelectedOption('subscription')}
        />

        {!isRegistered && (
          <PaymentOptionCard
            option="both"
            amount={paymentOptions.both.amount}
            label={paymentOptions.both.label}
            description={paymentOptions.both.description}
            selected={selectedOption === 'both'}
            onSelect={() => setSelectedOption('both')}
            isRecommended
          />
        )}
      </div>

      <MembershipBenefits />

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
  );
};

export default PaymentOptionsForm;
