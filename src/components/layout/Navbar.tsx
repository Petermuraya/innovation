import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
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
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
        { name: 'Current Projects', href: '/projects/current' },
        { name: 'Past Projects', href: '/projects/past' },
        { name: 'Get Involved', href: '/projects/involved' }
      ]
    },
    { 
      name: 'Events', 
      href: '/events',
      dropdown: [
        { name: 'Upcoming Events', href: '/events/upcoming' },
        { name: 'Past Events', href: '/events/past' },
        { name: 'Event Calendar', href: '/events/calendar' }
      ]
    },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Community', href: '/community' },
    { name: 'Careers', href: '/careers' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <nav 
      ref={navbarRef}
      className={cn(
        "bg-white sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "shadow-lg py-2" : "shadow-sm py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 flex-shrink-0"
            aria-label="Home"
          >
            <div className="w-10 h-10 bg-kic-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">KIC</span>
            </div>
            <span className="text-xl font-bold text-kic-gray hidden sm:inline">
              Innovation Club
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 ml-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center px-4 py-2 text-kic-gray hover:text-kic-green-600 transition-colors duration-200"
                      aria-expanded={activeDropdown === item.name}
                      aria-haspopup="true"
                    >
                      {item.name}
                      {activeDropdown === item.name ? (
                        <ChevronUp className="ml-1 w-4 h-4" />
                      ) : (
                        <ChevronDown className="ml-1 w-4 h-4" />
                      )}
                    </button>
                    <div
                      className={cn(
                        "absolute left-0 mt-0 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 transition-all duration-200",
                        activeDropdown === item.name ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 pointer-events-none"
                      )}
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-2 text-sm text-kic-gray hover:bg-kic-green-50 hover:text-kic-green-600"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="px-4 py-2 text-kic-gray hover:text-kic-green-600 transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4 ml-auto">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-kic-green-500 hover:bg-kic-green-600">
                    Join Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-2 pt-2 pb-4 space-y-1 bg-white border-t">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex justify-between items-center w-full px-3 py-2 text-kic-gray hover:text-kic-green-600"
                      aria-expanded={activeDropdown === item.name}
                    >
                      {item.name}
                      {activeDropdown === item.name ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
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
                          className="block px-3 py-2 text-sm text-kic-gray hover:text-kic-green-600"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="block px-3 py-2 text-kic-gray hover:text-kic-green-600"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            <div className="border-t pt-4 mt-4">
              {user ? (
                <div className="space-y-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 text-kic-gray hover:text-kic-green-600"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-kic-gray hover:text-kic-green-600"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-kic-gray hover:text-kic-green-600"
                  >
                    <div className="flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="w-full px-3 py-2 text-center text-kic-gray hover:text-kic-green-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full px-3 py-2 text-center bg-kic-green-500 text-white rounded hover:bg-kic-green-600"
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