
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardSwitcherInfoProps {
  currentView: 'admin' | 'user';
  roleDisplayName: string;
}

const DashboardSwitcherInfo = ({ currentView, roleDisplayName }: DashboardSwitcherInfoProps) => {
  return (
    <div className="space-y-1">
      <motion.h3 
        className="font-bold text-xl"
        animate={{ 
          color: currentView === 'admin' ? '#3b82f6' : '#10b981' 
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentView}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'admin' ? 'Admin Dashboard' : 'Member Dashboard'}
          </motion.span>
        </AnimatePresence>
      </motion.h3>
      
      <motion.p 
        className="text-sm font-medium"
        animate={{ 
          color: currentView === 'admin' ? '#6366f1' : '#059669' 
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={`${currentView}-${roleDisplayName}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'admin' 
              ? `${roleDisplayName} • Administrative Access`
              : 'Standard Member • Club Participation'
            }
          </motion.span>
        </AnimatePresence>
      </motion.p>
    </div>
  );
};

export default DashboardSwitcherInfo;
