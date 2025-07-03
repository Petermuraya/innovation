import { motion } from "framer-motion";
import ResponsiveHeroImageCarousel from "./ResponsiveHeroImageCarousel";

interface HeroImageCarouselProps {
  isVisible: boolean;
  isMobile?: boolean;
  className?: string;
  fullScreenMode?: boolean;
}

const imageVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

export default function HeroImageCarousel({ 
  isVisible, 
  isMobile, 
  className = "",
  fullScreenMode = false
}: HeroImageCarouselProps) {
  return (
    <motion.div
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={imageVariants}
      className={`relative overflow-hidden ${fullScreenMode ? 'h-screen' : 'h-full'} ${className}`}
    >
      <div className={`absolute inset-0 ${fullScreenMode ? 'bg-black/30' : ''}`} />
      
      <ResponsiveHeroImageCarousel 
        isVisible={isVisible} 
        isMobile={isMobile}
        fullScreenMode={fullScreenMode}
      />
      
      {/* Gradient overlay for better text visibility */}
      {fullScreenMode && (
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      )}
    </motion.div>
  );
}