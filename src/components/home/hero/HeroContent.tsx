import { motion } from "framer-motion";
import HeroText from "./HeroText";
import HeroActions from "./HeroActions";
import HeroFeatures from "./HeroFeatures";
import HeroImageCarousel from "./HeroImageCarousel";

interface HeroContentProps {
  isVisible: boolean;
  typingWords: string[];
  isMobile?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.4 }
};

export default function HeroContent({ isVisible, typingWords, isMobile }: HeroContentProps) {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Full-screen background image */}
      <div className="absolute inset-0 z-0">
        <HeroImageCarousel 
          isVisible={isVisible}
          isMobile={isMobile}
          className="w-full h-full object-cover"
          fullScreenMode
        />
      </div>

      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black z-1"
        variants={overlayVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
      />

      {/* Content container */}
      <motion.div
        className="relative z-2 h-full flex items-center"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <div className="max-w-2xl">
            <motion.div variants={textVariants}>
              <HeroText
                isVisible={isVisible}
                typingWords={typingWords}
                isMobile={isMobile}
                className="text-white drop-shadow-lg"
                textSize="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
              />
            </motion.div>

            <motion.div 
              className="mt-8 sm:mt-12"
              variants={textVariants}
              transition={{ delay: 0.2 }}
            >
              <HeroActions
                isVisible={isVisible}
                isMobile={isMobile}
                className="flex flex-wrap gap-4"
                buttonStyle="bg-white/90 hover:bg-white text-gray-900 px-8 py-4 text-lg font-semibold rounded-lg backdrop-blur-sm transition-all hover:scale-105"
                secondaryButtonStyle="bg-transparent border-2 border-white/80 hover:border-white text-white px-8 py-4 text-lg font-semibold rounded-lg backdrop-blur-sm transition-all hover:scale-105"
              />
            </motion.div>

            <motion.div
              className="mt-12 sm:mt-16"
              variants={textVariants}
              transition={{ delay: 0.4 }}
            >
              <HeroFeatures
                isVisible={isVisible}
                isMobile={isMobile}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                featureStyle="text-white backdrop-blur-sm bg-white/10 p-4 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                iconStyle="text-white/80 group-hover:text-white"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}