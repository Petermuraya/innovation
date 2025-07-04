
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import MobileNavLinks from './MobileNavLinks';
import MobileAuthSection from './MobileAuthSection';

interface MobileMenuPanelProps {
  activeDropdown: string | null;
  member: any;
  onToggleDropdown: (itemName: string) => void;
  onSignOut: () => void;
}

const MobileMenuPanel: React.FC<MobileMenuPanelProps> = ({
  activeDropdown,
  member,
  onToggleDropdown,
  onSignOut,
}) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-kic-green-500 to-kic-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KIC</span>
          </div>
        </div>

        <nav className="space-y-2">
          <MobileNavLinks
            activeDropdown={activeDropdown}
            onToggleDropdown={onToggleDropdown}
          />
        </nav>

        <MobileAuthSection member={member} onSignOut={onSignOut} />
      </div>
    </motion.div>
  );
};

export default MobileMenuPanel;
