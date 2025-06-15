
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

interface DashboardSwitcherToggleProps {
  currentView: 'admin' | 'user';
  isAnimating: boolean;
  onToggle: (checked: boolean) => void;
}

const DashboardSwitcherToggle = ({ currentView, isAnimating, onToggle }: DashboardSwitcherToggleProps) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-3">
        <motion.span 
          className="text-sm font-semibold"
          animate={{ 
            color: currentView === 'user' ? '#10b981' : '#6b7280',
            scale: currentView === 'user' ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          Member
        </motion.span>
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Switch
            checked={currentView === 'admin'}
            onCheckedChange={onToggle}
            disabled={isAnimating}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-green-500 data-[state=unchecked]:to-emerald-600"
          />
        </motion.div>
        
        <motion.span 
          className="text-sm font-semibold"
          animate={{ 
            color: currentView === 'admin' ? '#3b82f6' : '#6b7280',
            scale: currentView === 'admin' ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          Admin
        </motion.span>
      </div>
      
      <motion.div
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
      >
        <Settings className="w-5 h-5 text-gray-400" />
      </motion.div>
    </div>
  );
};

export default DashboardSwitcherToggle;
