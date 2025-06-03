
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface PaymentOptionCardProps {
  option: 'registration' | 'subscription' | 'both';
  amount: number;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  isRecommended?: boolean;
}

const PaymentOptionCard = ({ 
  option, 
  amount, 
  label, 
  description, 
  selected, 
  onSelect,
  isRecommended = false 
}: PaymentOptionCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        selected 
          ? option === 'both' 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">{label}</h3>
            {isRecommended && (
              <Badge variant="default" className="text-xs">
                Best Value
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <Badge variant={option === 'both' ? 'default' : 'outline'} className="text-lg font-mono">
          KSh {amount}
        </Badge>
      </div>
    </motion.div>
  );
};

export default PaymentOptionCard;
