
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface MobileNavLinksProps {
  activeDropdown: string | null;
  onToggleDropdown: (itemName: string) => void;
}

const MobileNavLinks: React.FC<MobileNavLinksProps> = ({
  activeDropdown,
  onToggleDropdown,
}) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center px-4 py-3 text-gray-700 hover:bg-kic-green-50 hover:text-kic-green-700 rounded-lg transition-all duration-300 ${
            location.pathname === item.href ? 'bg-kic-green-50 text-kic-green-700' : ''
          }`}
        >
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );
};

export default MobileNavLinks;
