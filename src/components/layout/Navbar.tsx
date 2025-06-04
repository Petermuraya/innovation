import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, ChevronDown, ChevronUp, ArrowRight, Users, Briefcase, Info, Home, BookOpen, Calendar, Layers } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import clubLogo from "/public/inovationclub.svg";

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
          icon: <BookOpen className="w-4 h-4 text-kic-green-500" />
        },
        { 
          name: 'Careers', 
          href: '/careers', 
          description: 'Explore opportunities',
          icon: <Briefcase className="w-4 h-4 text-kic-green-500" />
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
        "bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled ? "border-gray-100 py-2 shadow-sm" : "border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
         <Link 
  to="/" 
  className="flex items-center space-x-3 flex-shrink-0 group"
  aria-label="Home"
>
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="flex items-center space-x-3"
  >
    {/* Logo */}
    <img 
      src="public/inovationclub.svg" 
      alt="Innovation Club Logo"
      className="w-16 h-16 object-contain"
    />

    {/* Text Content */}
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">
        INNOVATION CLUB
      </h1>
      <p className="text-xs text-gray-600">KARATINA UNIVERSITY</p>
      <p className="text-xs text-kic-green-600 font-medium italic">
        DREAM, CREATE AND INSPIRE FOR A BETTER FUTURE
      </p>
    </div>
  </motion.div>
</Link>


          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-kic-green-600 transition-colors duration-200 font-medium text-sm group"
                      aria-expanded={activeDropdown === item.name}
                      aria-haspopup="true"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                      <ChevronDown className={cn(
                        "ml-1 w-4 h-4 transition-transform duration-200",
                        activeDropdown === item.name ? "rotate-180 text-kic-green-600" : "text-gray-400 group-hover:text-kic-green-600 group-hover:translate-y-0.5"
                      )} />
                    </motion.button>
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2 w-64 rounded-xl shadow-lg bg-white border border-gray-100 py-2 z-50"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="block px-4 py-3 hover:bg-gray-50 group transition-colors duration-150"
                            >
                              <div className="flex items-start">
                                <div className="mr-3 mt-0.5">
                                  {subItem.icon}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 group-hover:text-kic-green-600">
                                    {subItem.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
                                    {subItem.description}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-kic-green-500 mt-0.5 ml-2 transition-colors" />
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <Link
                      to={item.href}
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-kic-green-600 transition-colors duration-200 font-medium text-sm"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-3 ml-6">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded-lg"
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
                    className="flex items-center space-x-2 border-gray-300 rounded-lg"
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
                      className="text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
                <Link to="/register">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 shadow-sm rounded-lg text-white"
                    >
                      Join Now
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                className="text-gray-700 hover:bg-gray-100 rounded-lg"
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
              <div className="px-2 pt-2 pb-6 space-y-1 bg-white">
                <div className="grid gap-1">
                  {navItems.map((item) => (
                    <div key={item.name} className="space-y-1">
                      {item.dropdown ? (
                        <>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleDropdown(item.name)}
                            className="flex justify-between items-center w-full px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg"
                            aria-expanded={activeDropdown === item.name}
                          >
                            <div className="flex items-center">
                              <span className="mr-3">{item.icon}</span>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            {activeDropdown === item.name ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
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
                            <div className="space-y-2 py-1">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
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
                          className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-2">
                  {user ? (
                    <div className="space-y-2">
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <User className="w-5 h-5 mr-3" />
                        <span>Dashboard</span>
                      </Link>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <Link
                        to="/login"
                        className="w-full px-4 py-2.5 text-center font-medium text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200"
                      >
                        Sign In
                      </Link>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Link
                          to="/register"
                          className="block w-full px-4 py-2.5 text-center font-medium text-white bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 rounded-lg shadow-sm"
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