import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Info, 
  FolderOpen, 
  BookOpen, 
  Calendar, 
  Briefcase, 
  User, 
  Settings, 
  LogOut,
  Shield,
  Users
} from 'lucide-react';

interface MobileMenuPanelProps {
  activeDropdown: string | null;
  member: any;
  onToggleDropdown: (itemName: string) => void;
  onSignOut: () => void;
  className?: string;
  activeItemClassName?: string;
  dropdownItemClassName?: string;
  dividerClassName?: string;
  signOutButtonClassName?: string;
}

const MobileMenuPanel = ({ 
  activeDropdown, 
  member, 
  onToggleDropdown, 
  onSignOut,
  className,
  activeItemClassName = "bg-gradient-to-r from-amber-100/80 to-emerald-100/80 text-emerald-800 border-l-4 border-amber-400",
  dropdownItemClassName = "hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-emerald-50/50 text-gray-700 hover:text-emerald-700",
  dividerClassName = "border-gradient-to-r from-amber-200/50 to-emerald-200/50",
  signOutButtonClassName = "bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white shadow-lg shadow-amber-500/20"
}: MobileMenuPanelProps) => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Projects', path: '/projects', icon: FolderOpen },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Careers', path: '/careers', icon: Briefcase },
  ];

  const adminItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Settings },
    { name: 'Admin Panel', path: '/admin', icon: Shield },
    { name: 'User Management', path: '/admin/users', icon: Users }
  ];

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        transition: { 
          type: 'spring', 
          stiffness: 300, 
          damping: 30,
          delayChildren: 0.2,
          staggerChildren: 0.05
        } 
      }}
      exit={{ 
        x: '100%', 
        opacity: 0,
        transition: { ease: 'easeInOut', duration: 0.3 }
      }}
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl",
        "z-[10002] overflow-hidden",
        className
      )}
      style={{
        isolation: 'isolate',
        transform: 'translateZ(0)',
        borderLeft: '1px solid rgba(236, 253, 245, 0.5)'
      }}
    >
      {/* Golden-to-green gradient accent */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 via-emerald-400 to-amber-400" />
      
      <div className="flex flex-col h-full">
        {/* Header with subtle gradient */}
        <div className="p-6 border-b bg-gradient-to-r from-amber-50/70 to-emerald-50/70">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-emerald-600"
          >
            Navigation Menu
          </motion.h2>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  transition: { delay: 0.1 + index * 0.05 }
                }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                    "group hover:shadow-sm",
                    isActive ? activeItemClassName : dropdownItemClassName
                  )}
                  onClick={() => onToggleDropdown(item.name)}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-colors",
                    isActive ? "text-amber-600" : "text-gray-500 group-hover:text-emerald-600"
                  )} />
                  <span className="font-medium">
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div 
                      className="ml-auto w-2 h-2 rounded-full bg-emerald-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className={cn("p-4 border-t", dividerClassName)}>
          {member ? (
            <div className="space-y-3">
              {/* User Profile with gradient border */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative p-0.5 rounded-xl bg-gradient-to-r from-amber-400/30 to-emerald-400/30"
              >
                <div className="flex items-center gap-3 p-3 bg-white/95 rounded-[10px] backdrop-blur-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Admin Links */}
              <div className="space-y-1">
                {adminItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.5 + index * 0.1 }
                    }}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg text-sm transition-colors",
                        dropdownItemClassName
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Sign Out Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button 
                    onClick={onSignOut}
                    className={cn(
                      "w-full justify-start gap-3 mt-2 transition-all hover:shadow-lg",
                      signOutButtonClassName
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/login">
                <Button className={cn(
                  "w-full transition-all hover:shadow-lg",
                  "bg-gradient-to-r from-amber-500 to-emerald-600",
                  "hover:from-amber-600 hover:to-emerald-700 text-white"
                )}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  className="w-full border-amber-300 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-emerald-50/50 hover:text-emerald-700 hover:border-emerald-300 transition-all"
                >
                  Join Our Community
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenuPanel;