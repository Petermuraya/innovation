
import { motion } from 'framer-motion';

interface DashboardSwitcherProgressBarProps {
  currentView: 'admin' | 'user';
}

const DashboardSwitcherProgressBar = ({ currentView }: DashboardSwitcherProgressBarProps) => {
  return (
    <motion.div 
      className="mt-4 flex items-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        className="h-1 rounded-full flex-1"
        animate={{
          background: currentView === 'admin'
            ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
            : 'linear-gradient(90deg, #10b981, #059669)'
        }}
        transition={{ duration: 0.5 }}
      />
      <motion.span 
        className="text-xs font-medium"
        animate={{ 
          color: currentView === 'admin' ? '#6366f1' : '#059669' 
        }}
      >
        {currentView === 'admin' ? 'Administrative Mode' : 'Member Experience'}
      </motion.span>
    </motion.div>
  );
};

export default DashboardSwitcherProgressBar;
