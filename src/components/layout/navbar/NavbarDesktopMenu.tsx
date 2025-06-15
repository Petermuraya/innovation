
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ArrowRight, 
  Home, 
  Info, 
  BookOpen, 
  Calendar, 
  Layers, 
  Users, 
  Briefcase 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NavbarDesktopMenu = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);

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

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { 
      name: 'Home', 
      href: '/',
      icon: <Home className="w-4 h-4" />
    },
    { 
      name: 'About Us', 
      href: '/about',
      icon: <Info className="w-4 h-4" />,
      dropdown: [
        { 
          name: 'Our Story', 
          href: '/about', 
          description: 'Learn about our journey',
          icon: <BookOpen className="w-4 h-4 text-kic-green-600" />
        },
        { 
          name: 'Careers', 
          href: '/careers', 
          description: 'Explore opportunities',
          icon: <Briefcase className="w-4 h-4 text-kic-green-600" />
        }
      ]
    },
    { 
      name: 'Projects', 
      href: '/projects',
      icon: <Layers className="w-4 h-4" />
    },
    { 
      name: 'Events', 
      href: '/events',
      icon: <Calendar className="w-4 h-4" />
    },
    { 
      name: 'Blog', 
      href: '/blogs',
      icon: <BookOpen className="w-4 h-4" />
    },
    { 
      name: 'Leaderboard', 
      href: '/leaderboard',
      icon: <Users className="w-4 h-4" />
    }
  ];

  return (
    <div ref={navbarRef} className="hidden lg:flex items-center space-x-2">
      {navItems.map((item) => (
        <div key={item.name} className="relative">
          {item.dropdown ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDropdown(item.name)}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg group relative",
                  "hover:bg-kic-green-50 hover:text-kic-green-700",
                  activeDropdown === item.name 
                    ? "bg-kic-green-100 text-kic-green-700" 
                    : "text-gray-700"
                )}
                aria-expanded={activeDropdown === item.name}
                aria-haspopup="true"
              >
                <span className="mr-2 transition-colors duration-300">{item.icon}</span>
                {item.name}
                <ChevronDown className={cn(
                  "ml-2 w-4 h-4 transition-all duration-300",
                  activeDropdown === item.name 
                    ? "rotate-180 text-kic-green-600" 
                    : "text-gray-400 group-hover:text-kic-green-600"
                )} />
                {/* Active indicator */}
                <div className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-kic-green-500 to-kic-green-600 transition-all duration-300 rounded-full",
                  activeDropdown === item.name ? "w-8" : "group-hover:w-4"
                )} />
              </motion.button>
              <AnimatePresence>
                {activeDropdown === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                    className="absolute left-0 mt-2 w-72 rounded-xl shadow-2xl bg-white border border-kic-green-100 py-3 z-50 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-kic-green-50/50 to-white"></div>
                    <div className="relative">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block px-4 py-3 hover:bg-kic-green-50 group transition-all duration-200 relative"
                        >
                          <div className="flex items-start">
                            <div className="mr-3 mt-0.5 p-1.5 rounded-lg bg-kic-green-100 group-hover:bg-kic-green-200 transition-colors duration-200">
                              {subItem.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-kic-green-700 transition-colors duration-200">
                                {subItem.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 group-hover:text-kic-green-600 transition-colors duration-200">
                                {subItem.description}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-kic-green-500 mt-0.5 ml-2 transition-all duration-200 group-hover:translate-x-1" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg group relative",
                  isActivePath(item.href)
                    ? "bg-kic-green-100 text-kic-green-700"
                    : "text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700"
                )}
              >
                <span className="mr-2 transition-colors duration-300">{item.icon}</span>
                {item.name}
                {/* Active indicator */}
                <div className={cn(
                  "absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-kic-green-500 to-kic-green-600 transition-all duration-300 rounded-full",
                  isActivePath(item.href) 
                    ? "w-8" 
                    : "w-0 group-hover:w-4"
                )} />
              </Link>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavbarDesktopMenu;
