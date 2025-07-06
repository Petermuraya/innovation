import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from "@/assets/Innovation Club New Logo- Website Browser Icon.png";

const NavbarLogo = () => {
  const [isRotating, setIsRotating] = useState(false);
  const bulbControls = useAnimation();
  const lightControls = useAnimation();
  const rotateControls = useAnimation();

  // Blinking animation effect - starts immediately on load
  useEffect(() => {
    const blink = async () => {
      while (!isRotating) { // Only blink when not rotating
        await bulbControls.start({
          opacity: 0.8,
          transition: { duration: 0.8, ease: "easeInOut" }
        });
        await bulbControls.start({
          opacity: 1,
          transition: { duration: 0.8, ease: "easeInOut" }
        });
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      }
    };
    
    blink();

    return () => bulbControls.stop(); // Cleanup
  }, [bulbControls, isRotating]);

  const handleHoverStart = async () => {
    if (isRotating) return;
    
    bulbControls.stop();
    await bulbControls.start({ opacity: 1 });
    lightControls.start({
      opacity: 1,
      scale: 1.2,
      transition: { duration: 0.3 }
    });
  };

  const handleHoverEnd = () => {
    if (isRotating) return;
    
    lightControls.start({
      opacity: 0,
      scale: 1,
      transition: { duration: 0.3 }
    });
    // Blinking will resume automatically through the useEffect
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRotating(true);
    
    // Stop blinking and any hover effects
    bulbControls.stop();
    lightControls.start({ opacity: 0 });
    
    // Start continuous rotation
    await rotateControls.start({
      rotate: 360,
      transition: { 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }
    });
    
    // Refresh page after 1 full rotation
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Link 
      to="/" 
      className="flex items-center flex-shrink-0 group relative"
      aria-label="Home"
      onClick={handleClick}
    >
      <motion.div 
        className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4"
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
      >
        {/* Bulb Container */}
        <div className="relative flex-shrink-0">
          {/* Glow effect - lights up on hover */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/70 to-yellow-100/90 opacity-0 blur-[15px]"
            animate={lightControls}
            initial={{ opacity: 0, scale: 1 }}
          />
          
          {/* Bulb filament effect */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-300 rounded-full -translate-x-1/2 -translate-y-1/2"
            animate={lightControls}
            initial={{ opacity: 0, scale: 1 }}
          />
          
          {/* Main bulb image with blinking effect */}
          <motion.img 
            src={Logo}
            alt="Innovation Club Logo"
            className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain cursor-pointer"
            animate={isRotating ? rotateControls : bulbControls}
            initial={{ opacity: 1 }}
            style={{ originX: 0.5, originY: 0.5 }}
            whileTap={{ scale: 0.9 }}
          />
          
          {/* Light rays - only visible when lit */}
          <motion.div 
            className="absolute inset-0 opacity-0 pointer-events-none"
            animate={lightControls}
            initial={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-16 h-1 bg-yellow-300/30"
                style={{
                  rotate: i * 45,
                  transformOrigin: 'left center',
                  x: 8,
                  y: -0.5
                }}
                animate={{
                  scaleX: [0.5, 1, 0.5],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wider leading-tight">
            <span 
              className="bg-gradient-to-r from-kic-green-600 via-yellow-500 to-kic-green-700 bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 4s ease infinite',
                display: 'inline-block'
              }}
            >
              INNOVATION CLUB
            </span>
          </h1>
          
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">
            KARATINA UNIVERSITY
          </p>
          
          <p className="hidden sm:block text-[0.6rem] lg:text-[0.65rem] text-kic-green-600 font-medium italic leading-tight tracking-wide mt-0.5">
            DREAM, CREATE & INSPIRE FOR A BETTER FUTURE
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default NavbarLogo;