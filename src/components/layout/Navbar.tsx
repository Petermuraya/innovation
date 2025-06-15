
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, ChevronDown, ChevronUp, ArrowRight, Users, Briefcase, Info, Home, BookOpen, Calendar, Layers } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from "@/assets/Logo.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <nav 
      ref={navbarRef}
      className={cn(
        "bg-white/95 backdrop-blur-lg sticky top-0 z-50 transition-all duration-500 border-b-2",
        isScrolled 
          ? "border-kic-green-200 py-2 shadow-lg shadow-kic-green-100/20" 
          : "border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 flex-shrink-0 group"
            aria-label="Home"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              {/* Logo with enhanced styling */}
              <div className="relative">
                <img 
                  src={Logo}
                  alt="Innovation Club Logo"
                  className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-kic-green-500/20 to-kic-green-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Text Content with enhanced styling */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-kic-green-700 to-kic-green-600 bg-clip-text text-transparent uppercase tracking-wider">
                  INNOVATION CLUB
                </h1>
                <p className="text-xs text-kic-green-600/80 font-medium">KARATINA UNIVERSITY</p>
                <p className="text-[0.65rem] text-kic-green-500 font-medium italic leading-tight tracking-wide">
                  DREAM, CREATE & INSPIRE FOR A BETTER FUTURE
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleDropdown(item.name)}
                      className={cn(
                        "flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg group relative",
                        "hover:bg-kic-green-50 hover:text-kic-green-700",
                        activeDropdown === item.name 
                          ? "bg-kic-green-100 text-kic-green-700" 
                          : "text-gray-700"
                      )}
                      aria-expanded={activeDropdown === item.name}
                      aria-haspopup="true"
                    >
                      <span className="mr-2 transition-colors duration-300">{item.icon}</span>
                      {item.name}
                      <ChevronDown className={cn(
                        "ml-2 w-4 h-4 transition-all duration-300",
                        activeDropdown === item.name 
                          ? "rotate-180 text-kic-green-600" 
                          : "text-gray-400 group-hover:text-kic-green-600"
                      )} />
                      {/* Active indicator */}
                      <div className={cn(
                        "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-kic-green-500 to-kic-green-600 transition-all duration-300 rounded-full",
                        activeDropdown === item.name ? "w-8" : "group-hover:w-4"
                      )} />
                    </motion.button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                          className="absolute left-0 mt-2 w-72 rounded-xl shadow-2xl bg-white border border-kic-green-100 py-3 z-50 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-kic-green-50/50 to-white"></div>
                          <div className="relative">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className="block px-4 py-3 hover:bg-kic-green-50 group transition-all duration-200 relative"
                              >
                                <div className="flex items-start">
                                  <div className="mr-3 mt-0.5 p-1.5 rounded-lg bg-kic-green-100 group-hover:bg-kic-green-200 transition-colors duration-200">
                                    {subItem.icon}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-900 group-hover:text-kic-green-700 transition-colors duration-200">
                                      {subItem.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 group-hover:text-kic-green-600 transition-colors duration-200">
                                      {subItem.description}
                                    </p>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-kic-green-500 mt-0.5 ml-2 transition-all duration-200 group-hover:translate-x-1" />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg group relative",
                        isActivePath(item.href)
                          ? "bg-kic-green-100 text-kic-green-700"
                          : "text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700"
                      )}
                    >
                      <span className="mr-2 transition-colors duration-300">{item.icon}</span>
                      {item.name}
                      {/* Active indicator */}
                      <div className={cn(
                        "absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-kic-green-500 to-kic-green-600 transition-all duration-300 rounded-full",
                        isActivePath(item.href) 
                          ? "w-8" 
                          : "w-0 group-hover:w-4"
                      )} />
                    </Link>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced User Actions */}
          <div className="hidden lg:flex items-center space-x-3 ml-6">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center space-x-2 text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg border border-transparent hover:border-kic-green-200 transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Button>
                  </motion.div>
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 border-kic-green-200 hover:bg-kic-green-50 hover:border-kic-green-300 hover:text-kic-green-700 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg border border-transparent hover:border-kic-green-200 transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/register">
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -2 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 shadow-lg hover:shadow-xl shadow-kic-green-200 rounded-lg text-white font-semibold transition-all duration-300"
                    >
                      Join Now
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
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
        </div>

        {/* Enhanced Mobile Navigation */}
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
      </div>
    </nav>
  );
};

export default Navbar;
