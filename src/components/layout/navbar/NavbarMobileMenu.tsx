import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  ChevronUp,
  Home, 
  Info, 
  BookOpen, 
  Calendar, 
  Layers, 
  Users, 
  Briefcase 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const NavbarMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

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

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden flex items-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg border border-transparent hover:border-kic-green-200 transition-all duration-300"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="px-2 pt-4 pb-6 space-y-2 bg-gradient-to-br from-white to-kic-green-50/30 rounded-lg mt-4 border border-kic-green-100 shadow-lg">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <div key={item.name} className="space-y-1">
                    {item.dropdown ? (
                      <>
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleDropdown(item.name)}
                          className={cn(
                            "flex justify-between items-center w-full px-4 py-3 rounded-lg transition-all duration-300",
                            activeDropdown === item.name
                              ? "bg-kic-green-100 text-kic-green-700"
                              : "text-gray-900 hover:bg-kic-green-50"
                          )}
                          aria-expanded={activeDropdown === item.name}
                        >
                          <div className="flex items-center">
                            <span className="mr-3">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {activeDropdown === item.name ? (
                            <ChevronUp className="w-5 h-5 text-kic-green-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </motion.button>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={activeDropdown === item.name ? { 
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
                            {item.dropdown.map((subItem) => (
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
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300",
                          isActivePath(item.href)
                            ? "bg-kic-green-100 text-kic-green-700"
                            : "text-gray-900 hover:bg-kic-green-50 hover:text-kic-green-700"
                        )}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Enhanced Mobile Auth Section */}
              <div className="border-t border-kic-green-100 pt-4 mt-4">
                {user ? (
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
                      onClick={handleSignOut}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMobileMenu;
