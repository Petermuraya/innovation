
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

interface MobileAuthSectionProps {
  member: any;
  onSignOut: () => void;
}

const MobileAuthSection: React.FC<MobileAuthSectionProps> = ({ member, onSignOut }) => {
  return (
    <div className="border-t border-kic-green-100 pt-4 mt-4">
      {member ? (
        <div className="space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg transition-all duration-300"
          >
            <User className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </Link>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onSignOut}
            className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      ) : (
        <div className="grid gap-3">
          <Link
            to="/login"
            className="w-full px-4 py-3 text-center font-medium text-gray-900 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg border border-kic-green-200 transition-all duration-300"
          >
            Sign In
          </Link>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Link
              to="/register"
              className="block w-full px-4 py-3 text-center font-medium text-white bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 rounded-lg shadow-lg transition-all duration-300"
            >
              Join Now
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MobileAuthSection;
