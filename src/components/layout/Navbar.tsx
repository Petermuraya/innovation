import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
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
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { 
      name: 'Projects', 
      href: '/projects',
      dropdown: [
        { name: 'Current Projects', href: '/projects/current', description: 'Explore our ongoing initiatives' },
        { name: 'Past Projects', href: '/projects/past', description: 'See our successful completions' },
        { name: 'Get Involved', href: '/projects/involved', description: 'Contribute to our work' }
      ]
    },
    { 
      name: 'Events', 
      href: '/events',
      dropdown: [
        { name: 'Upcoming Events', href: '/events/upcoming', description: 'Join our next gatherings' },
        { name: 'Past Events', href: '/events/past', description: 'Relive our previous events' },
        { name: 'Event Calendar', href: '/events/calendar', description: 'Plan your participation' }
      ]
    },
    { name: 'Blog', href: '/blog' },
    { name: 'Community', href: '/community' },
  ];

  const resourcesItems = [
    { name: 'Careers', href: '/careers' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Knowledge Base', href: '/knowledge-base' },
  ];

  return (
    <nav 
      ref={navbarRef}
      className={cn(
        "bg-white sticky top-0 z-50 transition-all duration-300 border-b",
        isScrolled ? "border-gray-100 py-2" : "border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 flex-shrink-0 group"
            aria-label="Home"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-kic-green-500 to-kic-green-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <span className="text-white font-bold text-lg">KIC</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              Innovation Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-kic-green-600 transition-colors duration-200 font-medium text-sm group"
                      aria-expanded={activeDropdown === item.name}
                      aria-haspopup="true"
                    >
                      {item.name}
                      <ChevronDown className={cn(
                        "ml-1 w-4 h-4 transition-transform duration-200",
                        activeDropdown === item.name ? "rotate-180" : "group-hover:translate-y-0.5"
                      )} />
                    </button>
                    <div
                      className={cn(
                        "absolute left-0 mt-2 w-64 rounded-xl shadow-lg bg-white border border-gray-100 py-2 z-50 transition-all duration-200",
                        activeDropdown === item.name ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                      )}
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-3 hover:bg-gray-50 group"
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-kic-green-600">
                                {subItem.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {subItem.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-kic-green-600 mt-0.5 ml-2" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="px-3 py-2 text-gray-700 hover:text-kic-green-600 transition-colors duration-200 font-medium text-sm"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Resources dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('Resources')}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-kic-green-600 transition-colors duration-200 font-medium text-sm group"
                aria-expanded={activeDropdown === 'Resources'}
                aria-haspopup="true"
              >
                Resources
                <ChevronDown className={cn(
                  "ml-1 w-4 h-4 transition-transform duration-200",
                  activeDropdown === 'Resources' ? "rotate-180" : "group-hover:translate-y-0.5"
                )} />
              </button>
              <div
                className={cn(
                  "absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-white border border-gray-100 py-2 z-50 transition-all duration-200",
                  activeDropdown === 'Resources' ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                )}
              >
                {resourcesItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:text-kic-green-600 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-3 ml-6">
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="border-gray-300">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 border-gray-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-700 hover:bg-gray-100">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 shadow-sm"
                  >
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="text-gray-700 hover:bg-gray-100"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-2 pt-2 pb-6 space-y-1 bg-white">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex justify-between items-center w-full px-3 py-3 text-gray-900 hover:bg-gray-50 rounded-lg"
                        aria-expanded={activeDropdown === item.name}
                      >
                        <span className="font-medium">{item.name}</span>
                        {activeDropdown === item.name ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      <div
                        className={cn(
                          "pl-4 space-y-1 transition-all duration-200",
                          activeDropdown === item.name ? "block" : "hidden"
                        )}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{subItem.name}</p>
                              <p className="text-sm text-gray-500 mt-1">{subItem.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-3 py-3 text-gray-900 hover:bg-gray-50 rounded-lg font-medium"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Resources mobile dropdown */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleDropdown('Resources')}
                  className="flex justify-between items-center w-full px-3 py-3 text-gray-900 hover:bg-gray-50 rounded-lg"
                  aria-expanded={activeDropdown === 'Resources'}
                >
                  <span className="font-medium">Resources</span>
                  {activeDropdown === 'Resources' ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <div
                  className={cn(
                    "pl-4 space-y-1 transition-all duration-200",
                    activeDropdown === 'Resources' ? "block" : "hidden"
                  )}
                >
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-2">
              {user ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-5 h-5 mr-2" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <Link
                    to="/login"
                    className="w-full px-4 py-2.5 text-center font-medium text-gray-900 hover:bg-gray-50 rounded-lg border border-gray-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full px-4 py-2.5 text-center font-medium text-white bg-gradient-to-r from-kic-green-500 to-kic-green-600 hover:from-kic-green-600 hover:to-kic-green-700 rounded-lg shadow-sm"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;