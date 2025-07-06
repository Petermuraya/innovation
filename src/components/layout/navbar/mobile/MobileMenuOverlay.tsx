import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 30,
      delayChildren: 0.2,
      staggerChildren: 0.05
    } 
  },
  exit: { 
    x: '100%',
    transition: { 
      ease: 'easeInOut',
      duration: 0.3
    } 
  },
};

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ isOpen, onClose, children }) => {
  if (typeof window === 'undefined') return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2147483646] flex lg:hidden"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
          {/* Gradient background overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-green-900/80 to-yellow-600/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-in panel with gradient border */}
          <motion.div
            className="relative ml-auto w-4/5 max-w-sm flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-green-50 rounded-l-lg shadow-2xl" />
            
            {/* Border gradient */}
            <div className="absolute inset-0 rounded-l-lg p-0.5 bg-gradient-to-b from-green-400 via-yellow-500 to-green-600" />
            
            {/* Content container */}
            <div className="relative flex-1 flex flex-col z-10 bg-white/95 rounded-l-lg">
              {/* Logo Section with gradient text */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60">
                <Link 
                  to="/" 
                  onClick={onClose} 
                  className="flex items-center"
                >
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-green-700">
                    YourLogo
                  </span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {React.Children.map(children, (child) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {child}
                  </motion.div>
                ))}
              </div>
              
              {/* Footer with subtle gradient */}
              <div className="px-6 py-4 border-t border-gray-200/60 bg-gradient-to-r from-green-50/30 via-yellow-50/30 to-green-50/30">
                <p className="text-sm text-gray-500 text-center">
                  © {new Date().getFullYear()} Your Company
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default MobileMenuOverlay;