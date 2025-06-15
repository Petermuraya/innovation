
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from "@/assets/Logo.svg";

const NavbarLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group"
      aria-label="Home"
    >
      <motion.div 
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center space-x-2 sm:space-x-3"
      >
        {/* Logo with enhanced styling */}
        <div className="relative flex-shrink-0">
          <img 
            src={Logo}
            alt="Innovation Club Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-kic-green-500/15 to-yellow-500/15 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        </div>

        {/* Text Content with enhanced styling and responsive design */}
        <div className="flex flex-col min-w-0">
          {/* Innovation Club with animated gradient transition */}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wider leading-tight">
            <span 
              className="bg-gradient-to-r from-kic-green-600 via-yellow-500 to-kic-green-700 bg-clip-text text-transparent animate-gradient-x"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 3s ease-in-out infinite alternate'
              }}
            >
              INNOVATION CLUB
            </span>
          </h1>
          
          {/* Karatina University in grey */}
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">
            KARATINA UNIVERSITY
          </p>
          
          {/* Tagline - Hidden on very small screens */}
          <p className="hidden sm:block text-[0.6rem] lg:text-[0.65rem] text-kic-green-600 font-medium italic leading-tight tracking-wide">
            DREAM, CREATE & INSPIRE FOR A BETTER FUTURE
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default NavbarLogo;
