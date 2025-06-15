
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from "@/assets/Logo.svg";

const NavbarLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-3 flex-shrink-0 group"
      aria-label="Home"
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center space-x-3"
      >
        {/* Logo with enhanced styling */}
        <div className="relative">
          <img 
            src={Logo}
            alt="Innovation Club Logo"
            className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-kic-green-500/20 to-kic-green-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Text Content with enhanced styling */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-kic-green-700 to-kic-green-600 bg-clip-text text-transparent uppercase tracking-wider">
            INNOVATION CLUB
          </h1>
          <p className="text-xs text-kic-green-600/80 font-medium">KARATINA UNIVERSITY</p>
          <p className="text-[0.65rem] text-kic-green-500 font-medium italic leading-tight tracking-wide">
            DREAM, CREATE & INSPIRE FOR A BETTER FUTURE
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default NavbarLogo;
