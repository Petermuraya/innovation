
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import NavbarLogo from './navbar/NavbarLogo';
import NavbarDesktopMenu from './navbar/NavbarDesktopMenu';
import NavbarUserActions from './navbar/NavbarUserActions';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "bg-white/95 backdrop-blur-lg sticky top-0 z-50 transition-all duration-500 border-b-2",
        isScrolled 
          ? "border-kic-green-200 py-2 shadow-lg shadow-kic-green-100/20" 
          : "border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <NavbarLogo />

          {/* Desktop Navigation */}
          <NavbarDesktopMenu />

          {/* User Actions */}
          <NavbarUserActions />

          {/* Mobile menu button */}
          <NavbarMobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
