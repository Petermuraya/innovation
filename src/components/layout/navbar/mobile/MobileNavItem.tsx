
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileNavItemProps {
  name: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ name, href, icon, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-300",
        isActive
          ? "bg-kic-green-100 text-kic-green-700"
          : "text-gray-900 hover:bg-kic-green-50 hover:text-kic-green-700"
      )}
    >
      <span className="mr-3">{icon}</span>
      {name}
    </Link>
  );
};

export default MobileNavItem;
