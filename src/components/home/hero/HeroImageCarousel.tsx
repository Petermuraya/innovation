import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkle, Zap, Users, Code, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    alt: "Innovation and technology",
    icon: <Zap className="w-8 h-8" />,
    title: "Cutting-Edge Technology"
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Team collaboration",
    icon: <Users className="w-8 h-8" />,
    title: "Collaborative Teams"
  },
  {
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Creative workspace",
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Creative Spaces"
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Coding and development",
    icon: <Code className="w-8 h-8" />,
    title: "Code The Future"
  }
];

interface HeroImageCarouselProps {
  isVisible: boolean;
}

export const HeroImageCarousel = ({ isVisible }: HeroImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const intervalRef = useRef<NodeJS.Timeout>();

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setDirection("right");
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goToPrevious = () => {
    setDirection("left");
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const goToNext = () => {
    setDirection("right");
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval();
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
    resetInterval();
  };

  const variants = {
    enter: (direction: string) => ({
      x: direction === "right" ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: string) => ({
      x: direction === "right" ? -1000 : 1000,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div 
      className={`relative transition-all duration-700 delay-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="relative">
        {/* Main image container with 3D perspective */}
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-emerald-400/20 shadow-2xl transform perspective-1000">
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.3 }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={heroImages[currentIndex].src}
                alt={heroImages[currentIndex].alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/70 via-transparent to-emerald-500/30" />
              
              {/* Floating card with current image info */}
              <div className="absolute bottom-8 left-8 bg-gradient-to-br from-emerald-500/20 to-emerald-800/30 backdrop-blur-lg p-6 rounded-2xl border border-emerald-400/30 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    {heroImages[currentIndex].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {heroImages[currentIndex].title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-100 text-sm">
                    Innovation in progress
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons with holographic effect */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/30 transition-all duration-200 shadow-lg hover:shadow-emerald-400/20 group"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-opacity pointer-events-none" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/30 transition-all duration-200 shadow-lg hover:shadow-emerald-400/20 group"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute inset-0 rounded-full border-2 border-emerald-400/30 opacity-0 group-hover:opacity-100 group-hover:animate-ping-slow transition-opacity pointer-events-none" />
          </Button>
        </div>

        {/* Enhanced dots indicator with progress bars */}
        <div className="flex justify-center mt-8 gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className="flex flex-col items-center group"
              onClick={() => goToSlide(index)}
            >
              <div className="relative w-12 h-1 bg-emerald-400/20 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-emerald-400 origin-left"
                  animate={{
                    width: index === currentIndex ? "100%" : "0%",
                    opacity: index === currentIndex ? 1 : 0.5
                  }}
                  transition={{
                    duration: 5,
                    ease: "linear"
                  }}
                />
              </div>
              <div
                className={`w-2 h-2 rounded-full mt-2 transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-emerald-400 scale-150" 
                    : "bg-emerald-400/30 group-hover:bg-emerald-400/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Floating tech elements */}
        <motion.div 
          className="absolute -top-6 -right-6 w-28 h-28 bg-emerald-400/10 rounded-2xl backdrop-blur-lg border border-emerald-300/30 flex items-center justify-center"
          initial={{ rotate: -15 }}
          animate={{ rotate: 15 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/20 animate-spin-slow [animation-delay:-7s]" />
          <div className="absolute inset-1 rounded-xl border-2 border-emerald-400/10 animate-spin-medium [animation-delay:-5s]" />
          <span className="text-emerald-300 text-3xl z-10">✨</span>
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-6 -left-6 w-40 h-24 bg-white/10 rounded-2xl backdrop-blur-lg border border-emerald-300/30 p-4"
          initial={{ y: 0 }}
          animate={{ y: -10 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-emerald-100 text-sm font-medium">Live Metrics</div>
          </div>
          <div className="flex justify-between items-center mt-1">
            <div className="text-white text-lg font-bold">98%</div>
            <div className="text-xs text-emerald-300 bg-emerald-900/30 px-2 py-1 rounded-full">
              +2.4%
            </div>
          </div>
        </motion.div>

        {/* Binary code animation for tech feel */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full h-10 overflow-hidden flex justify-center">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.span
              key={i}
              className="text-emerald-400/20 text-xs font-mono mx-1"
              initial={{ opacity: 0.1, y: 0 }}
              animate={{ opacity: [0.1, 0.4, 0.1], y: [0, -5, 0] }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {Math.random() > 0.5 ? "1" : "0"}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroImageCarousel;