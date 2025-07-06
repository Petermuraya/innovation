import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MobileMenuButton from './mobile/MobileMenuButton';
import MobileMenuOverlay from './mobile/MobileMenuOverlay'; // updated import
import { cn } from '@/lib/utils';

const NavbarMobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { member } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Events', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
        className: cn("bg-gradient-to-r from-amber-50 to-emerald-50 border-amber-200 text-amber-900")
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

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  // Auto-close on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  // Scroll lock logic
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }
  }, [isOpen]);

  return (
    <div className="lg:hidden relative z-[2147483645]">
      <MobileMenuButton isOpen={isOpen} onToggle={toggleMenu} />

      <AnimatePresence>
        {isOpen && (
          <MobileMenuOverlay isOpen={isOpen} onClose={closeMenu}>
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex justify-end p-4">
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-full bg-amber-100/50 hover:bg-amber-200/50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-amber-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block px-6 py-4 rounded-xl text-xl font-semibold",
                      "transition-all duration-300",
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-amber-100 to-emerald-100 text-amber-700 shadow-md"
                        : "text-gray-800 hover:bg-amber-50/70 hover:shadow-sm"
                    )}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto p-6 border-t border-amber-200">
                {member ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMenu();
                    }}
                    className={cn(
                      "w-full px-6 py-4 rounded-xl text-xl font-semibold text-center",
                      "bg-gradient-to-r from-amber-500 to-emerald-500 text-white",
                      "hover:from-amber-600 hover:to-emerald-600",
                      "shadow-lg hover:shadow-xl transition-all duration-300"
                    )}
                  >
                    Sign Out
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className={cn(
                      "block w-full px-6 py-4 rounded-xl text-xl font-semibold text-center",
                      "bg-gradient-to-r from-amber-500 to-emerald-500 text-white",
                      "hover:from-amber-600 hover:to-emerald-600",
                      "shadow-lg hover:shadow-xl transition-all duration-300"
                    )}
                    onClick={closeMenu}
                  >
                    Member Login
                  </Link>
                )}
              </div>
            </div>
          </MobileMenuOverlay>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarMobileMenu;
