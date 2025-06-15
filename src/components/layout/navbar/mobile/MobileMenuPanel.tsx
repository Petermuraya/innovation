
import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  Info, 
  BookOpen, 
  Calendar, 
  Layers, 
  Users, 
  Briefcase 
} from 'lucide-react';
import MobileNavItem from './MobileNavItem';
import MobileDropdownItem from './MobileDropdownItem';
import MobileAuthSection from './MobileAuthSection';

interface MobileMenuPanelProps {
  activeDropdown: string | null;
  user: any;
  onToggleDropdown: (itemName: string) => void;
  onSignOut: () => void;
}

const MobileMenuPanel: React.FC<MobileMenuPanelProps> = ({
  activeDropdown,
  user,
  onToggleDropdown,
  onSignOut
}) => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      name: 'Home', 
      href: '/',
      icon: <Home className="w-4 h-4" />
    },
    { 
      name: 'About Us', 
      href: '/about',
      icon: <Info className="w-4 h-4" />,
      dropdown: [
        { 
          name: 'Our Story', 
          href: '/about', 
          description: 'Learn about our journey',
          icon: <BookOpen className="w-4 h-4 text-kic-green-600" />
        },
        { 
          name: 'Careers', 
          href: '/careers', 
          description: 'Explore opportunities',
          icon: <Briefcase className="w-4 h-4 text-kic-green-600" />
        }
      ]
    },
    { 
      name: 'Projects', 
      href: '/projects',
      icon: <Layers className="w-4 h-4" />
    },
    { 
      name: 'Events', 
      href: '/events',
      icon: <Calendar className="w-4 h-4" />
    },
    { 
      name: 'Blog', 
      href: '/blogs',
      icon: <BookOpen className="w-4 h-4" />
    },
    { 
      name: 'Leaderboard', 
      href: '/leaderboard',
      icon: <Users className="w-4 h-4" />
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
      className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl border-t border-kic-green-100 shadow-2xl z-[95] lg:hidden"
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="px-4 py-6 space-y-2 bg-gradient-to-br from-white/95 to-kic-green-50/30">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <div key={item.name} className="space-y-1">
                {item.dropdown ? (
                  <MobileDropdownItem
                    name={item.name}
                    icon={item.icon}
                    dropdown={item.dropdown}
                    isActive={activeDropdown === item.name}
                    isExpanded={activeDropdown === item.name}
                    onToggle={() => onToggleDropdown(item.name)}
                  />
                ) : (
                  <MobileNavItem
                    name={item.name}
                    href={item.href}
                    icon={item.icon}
                    isActive={isActivePath(item.href)}
                  />
                )}
              </div>
            ))}
          </div>
          
          <MobileAuthSection user={user} onSignOut={onSignOut} />
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenuPanel;
