
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NavbarDesktopMenu = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Events', path: '/events' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <div className="flex items-center space-x-1 lg:space-x-2">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={cn(
            "relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium transition-all duration-300 rounded-lg group",
            "hover:bg-kic-green-50 hover:text-kic-green-700",
            location.pathname === item.path
              ? "text-kic-green-700 bg-kic-green-50"
              : "text-gray-700 hover:text-kic-green-700"
          )}
        >
          <span className="relative z-10">{item.name}</span>
          
          {/* Animated underline */}
          <div className={cn(
            "absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-kic-green-500 to-emerald-500 transition-all duration-300 transform -translate-x-1/2 rounded-full",
            location.pathname === item.path
              ? "w-full opacity-100"
              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          )} />
          
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-kic-green-50 to-emerald-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
      ))}
    </div>
  );
};

export default NavbarDesktopMenu;
