
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownSubItem {
  name: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}

interface MobileDropdownItemProps {
  name: string;
  icon: React.ReactNode;
  dropdown: DropdownSubItem[];
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

const MobileDropdownItem: React.FC<MobileDropdownItemProps> = ({
  name,
  icon,
  dropdown,
  isActive,
  isExpanded,
  onToggle
}) => {
  return (
    <div className="space-y-1">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={cn(
          "flex justify-between items-center w-full px-4 py-3 rounded-lg transition-all duration-300",
          isActive
            ? "bg-kic-green-100 text-kic-green-700"
            : "text-gray-900 hover:bg-kic-green-50"
        )}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center">
          <span className="mr-3">{icon}</span>
          <span className="font-medium">{name}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-kic-green-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </motion.button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isExpanded ? { 
          height: 'auto', 
          opacity: 1,
          transition: { duration: 0.3 }
        } : { 
          height: 0, 
          opacity: 0,
          transition: { duration: 0.2 }
        }}
        className="pl-12 overflow-hidden"
      >
        <div className="space-y-2 py-2">
          {dropdown.map((subItem) => (
            <Link
              key={subItem.name}
              to={subItem.href}
              className="block px-4 py-3 text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg transition-all duration-300"
            >
              <div className="flex items-center">
                <span className="mr-3">{subItem.icon}</span>
                <div>
                  <p className="font-medium">{subItem.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{subItem.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MobileDropdownItem;
