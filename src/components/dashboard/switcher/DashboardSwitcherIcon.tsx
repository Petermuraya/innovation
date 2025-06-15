
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Crown, Sparkles } from 'lucide-react';

interface DashboardSwitcherIconProps {
  currentView: 'admin' | 'user';
  isHighRole: boolean;
}

const DashboardSwitcherIcon = ({ currentView, isHighRole }: DashboardSwitcherIconProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <AnimatePresence mode="wait">
        {currentView === 'admin' ? (
          <motion.div
            key="admin-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.4, ease: "backInOut" }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg"
          >
            {isHighRole ? (
              <Crown className="w-6 h-6 text-white" />
            ) : (
              <Shield className="w-6 h-6 text-white" />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="user-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.4, ease: "backInOut" }}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg"
          >
            <User className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Sparkles className="w-2 h-2 text-yellow-800" />
      </motion.div>
    </motion.div>
  );
};

export default DashboardSwitcherIcon;
