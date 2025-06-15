
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
        "bg-white/98 backdrop-blur-xl sticky top-0 z-[100] transition-all duration-500 border-b-2 shadow-lg",
        isScrolled 
          ? "border-kic-green-200 py-2 shadow-xl shadow-kic-green-100/30 bg-white/99" 
          : "border-kic-green-100/50 py-3 shadow-lg shadow-kic-green-50/20"
      )}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center min-h-[64px] lg:min-h-[70px]">
          {/* Logo Section */}
          <div className="flex-shrink-0 max-w-[280px] sm:max-w-none">
            <NavbarLogo />
          </div>

          {/* Desktop Navigation - Hidden on smaller screens */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavbarDesktopMenu />
          </div>

          {/* User Actions - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:flex flex-shrink-0">
            <NavbarUserActions />
          </div>

          {/* Mobile menu button - Only shown on smaller screens */}
          <div className="lg:hidden flex-shrink-0">
            <NavbarMobileMenu />
          </div>
        </div>
      </div>

      {/* Enhanced backdrop for better content visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
    </nav>
  );
};

export default Navbar;
