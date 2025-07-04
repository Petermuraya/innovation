
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MobileMenuButton from './mobile/MobileMenuButton';
import MobileMenuOverlay from './mobile/MobileMenuOverlay';
import MobileMenuPanel from './mobile/MobileMenuPanel';

const NavbarMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { member } = useAuth();
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <>
      <MobileMenuButton isOpen={isOpen} onToggle={toggleMenu} />

      <AnimatePresence>
        {isOpen && (
          <>
            <MobileMenuOverlay onClose={closeMenu} />
            <MobileMenuPanel
              activeDropdown={activeDropdown}
              member={member}
              onToggleDropdown={toggleDropdown}
              onSignOut={handleSignOut}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarMobileMenu;
