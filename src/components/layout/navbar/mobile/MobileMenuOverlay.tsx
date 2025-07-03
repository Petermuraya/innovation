
import React from 'react';
import { motion } from 'framer-motion';

interface MobileMenuOverlayProps {
  onClose: () => void;
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9995] lg:hidden"
      onClick={onClose}
    />
  );
};

export default MobileMenuOverlay;
