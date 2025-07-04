
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getZIndexClass } from '@/lib/zIndexUtils';
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
}

const MobileMenuPanel = ({ 
  activeDropdown, 
  member, 
  onToggleDropdown, 
  onSignOut 
}: MobileMenuPanelProps) => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Projects', path: '/projects', icon: FolderOpen },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Careers', path: '/careers', icon: Briefcase },
  ];

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-kic-green-200/50",
        getZIndexClass('mobileMenu')
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-kic-green-100 bg-gradient-to-r from-kic-green-50 to-emerald-50">
          <h2 className="text-xl font-bold text-kic-green-700">Navigation</h2>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-kic-green-50 transition-colors group"
              >
                <Icon className="w-5 h-5 text-kic-green-600 group-hover:text-kic-green-700" />
                <span className="text-gray-700 group-hover:text-kic-green-700 font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="p-4 border-t border-kic-green-100 bg-gradient-to-r from-kic-green-50/50 to-emerald-50/50">
          {member ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-kic-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 hover:bg-kic-green-50"
                  >
                    <Settings className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                
                {member.role === 'admin' && (
                  <Link to="/admin">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3 hover:bg-kic-green-50"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={onSignOut}
                  className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/login">
                <Button className="w-full bg-gradient-to-r from-kic-green-500 to-emerald-600 hover:from-kic-green-600 hover:to-emerald-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="w-full border-kic-green-200 hover:bg-kic-green-50">
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
