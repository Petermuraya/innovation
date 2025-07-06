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
  ChevronDown,
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
  activeItemClassName = "bg-gradient-to-r from-amber-50 to-emerald-50 text-amber-700",
  dropdownItemClassName = "hover:bg-amber-50/50 text-gray-700",
  dividerClassName = "border-amber-100",
  signOutButtonClassName = "bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white"
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
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-amber-200/50",
        "z-[10002]", // Extreme z-index to guarantee overlay
        className
      )}
      style={{
        // Ensure new stacking context
        isolation: 'isolate',
        // Fallback for older browsers
        transform: 'translateZ(0)'
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header with golden-to-green gradient */}
        <div className="p-6 border-b bg-gradient-to-r from-amber-50 to-emerald-50">
          <h2 className="text-xl font-bold text-amber-800">Navigation</h2>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-colors",
                  "hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-emerald-50/50",
                  isActive ? activeItemClassName : "text-gray-700 hover:text-amber-700"
                )}
                onClick={() => onToggleDropdown(item.name)}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive ? "text-amber-600" : "text-gray-500 group-hover:text-amber-600"
                )} />
                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className={cn("p-4 border-t", dividerClassName)}>
          {member ? (
            <div className="space-y-3">
              {/* User Profile */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50/30 to-emerald-50/30 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              
              {/* Admin Links */}
              <div className="space-y-1">
                {adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl text-sm",
                      dropdownItemClassName
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Sign Out Button */}
                <Button 
                  onClick={onSignOut}
                  className={cn(
                    "w-full justify-start gap-3 mt-2",
                    signOutButtonClassName
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link to="/login">
                <Button className={cn(
                  "w-full bg-gradient-to-r from-amber-500 to-emerald-500",
                  "hover:from-amber-600 hover:to-emerald-600 text-white"
                )}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  className="w-full border-amber-300 hover:bg-amber-50/50 hover:text-amber-700"
                >
                  Join Us
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenuPanel;