import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MobileMenuButton from './mobile/MobileMenuButton';
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

  useEffect(() => {
    const handleScrollLock = () => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = `-${window.scrollY}px`;
      } else {
        const scrollY = document.body.style.top;
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
    handleScrollLock();
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <div className="lg:hidden" style={{ zIndex: 999999 }}>
      <MobileMenuButton
        isOpen={isOpen}
        onToggle={toggleMenu}
        className="text-amber-700 hover:text-amber-600"
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              style={{ zIndex: 2147483646 }}
              onClick={closeMenu}
            />

            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.5 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-b from-amber-50 to-white shadow-2xl"
              style={{ zIndex: 2147483647 }}
            >
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarMobileMenu;
