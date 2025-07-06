import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MobileNavItemProps {
  name: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  index?: number;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ 
  name, 
  href, 
  icon, 
  isActive,
  index = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          delay: 0.1 + index * 0.05,
          duration: 0.3
        }
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="px-2 py-1"
    >
      <Link
        to={href}
        className={cn(
          "flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200",
          "group relative overflow-hidden",
          isActive
            ? "bg-gradient-to-r from-kic-green-50 to-kic-green-100 text-kic-green-800 shadow-sm shadow-kic-green-100/50"
            : "text-gray-700 hover:bg-kic-green-50/80 hover:text-kic-green-700"
        )}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.span 
            className="absolute left-0 top-0 h-full w-1 bg-kic-green-500 rounded-r-full"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          />
        )}
        
        {/* Icon with transition */}
        <motion.span 
          className={cn(
            "mr-3 transition-colors",
            isActive ? "text-kic-green-600" : "text-gray-500 group-hover:text-kic-green-600"
          )}
          whileHover={{ scale: 1.1 }}
        >
          {icon}
        </motion.span>
        
        {/* Text with subtle grow animation */}
        <motion.span
          className="relative"
          whileHover={{ translateX: 2 }}
        >
          {name}
          {/* Underline effect on hover */}
          {!isActive && (
            <motion.span 
              className="absolute left-0 bottom-0 w-0 h-0.5 bg-kic-green-400 rounded-full"
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.span>
        
        {/* Active chevron */}
        {isActive && (
          <motion.span 
            className="ml-auto text-kic-green-500"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.span>
        )}
      </Link>
    </motion.div>
  );
};

export default MobileNavItem;