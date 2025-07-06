import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getZIndexClass } from '@/lib/zIndexUtils';
import NavbarLogo from './navbar/NavbarLogo';
import NavbarDesktopMenu from './navbar/NavbarDesktopMenu';
import NavbarUserActions from './navbar/NavbarUserActions';
import NavbarMobileMenu from './navbar/NavbarMobileMenu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 📌 added mobile menu toggle state
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={cn(
        "bg-white/98 backdrop-blur-xl sticky top-0 transition-all duration-500 border-b",
        getZIndexClass('navbar'),
        isScrolled 
          ? "border-amber-300/30 py-2 shadow-xl shadow-amber-300/10 bg-white/99" 
          : "border-amber-200/20 py-3 shadow-lg shadow-amber-200/5",
        isHovered ? "bg-white/100" : "",
        isMobileMenuOpen ? "z-40" : "" // 📌 drop z-40 when mobile menu is open
      )}
      style={{
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-emerald-500 opacity-0 transition-opacity duration-300",
        isHovered ? "opacity-100" : ""
      )} />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center min-h-[64px] lg:min-h-[70px]">
          <div className="flex-shrink-0 max-w-[280px] sm:max-w-none">
            <NavbarLogo />
          </div>

          <div className="hidden lg:flex flex-1 justify-center">
            <NavbarDesktopMenu />
          </div>

          <div className="hidden lg:flex flex-shrink-0">
            <NavbarUserActions />
          </div>

          <div className="lg:hidden flex-shrink-0">
            <NavbarMobileMenu 
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />

      {isHovered && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-amber-400/30 to-emerald-400/30 animate-particle"
              style={{
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
