import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
            "hover:text-amber-700",
            location.pathname === item.path
              ? "text-amber-700"
              : "text-gray-700 hover:text-amber-600"
          )}
        >
          <motion.span 
            className="relative z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {item.name}
          </motion.span>
          
          {/* Golden-to-green animated underline */}
          <div className={cn(
            "absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-500 transform -translate-x-1/2 rounded-full",
            location.pathname === item.path
              ? "w-full opacity-100"
              : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          )} />
          
          {/* Hover background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-50/70 to-emerald-50/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          
          {/* Golden glow effect on active item */}
          {location.pathname === item.path && (
            <motion.div 
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-100/50 to-emerald-100/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Link>
      ))}
    </div>
  );
};

export default NavbarDesktopMenu;