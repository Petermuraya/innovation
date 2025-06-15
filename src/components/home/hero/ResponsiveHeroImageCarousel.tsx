
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkle, Zap, Users, Code, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80",
    alt: "Innovation and technology",
    icon: <Zap className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
    title: "Cutting-Edge Technology"
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Team collaboration",
    icon: <Users className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
    title: "Collaborative Teams"
  },
  {
    src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Creative workspace",
    icon: <Lightbulb className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
    title: "Creative Spaces"
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Coding and development",
    icon: <Code className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />,
    title: "Code The Future"
  }
];

interface ResponsiveHeroImageCarouselProps {
  isVisible: boolean;
  isMobile?: boolean;
}

export default function ResponsiveHeroImageCarousel({ isVisible, isMobile }: ResponsiveHeroImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, isMobile ? 4000 : 5000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMobile]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
    resetInterval();
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    resetInterval();
  };

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startInterval();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetInterval();
  };

  return (
    <div 
      className={`relative transition-all duration-700 delay-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="relative">
        {/* Main image container with responsive aspect ratio */}
        <div className="relative aspect-square sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-400/20 shadow-2xl">
          <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out">
            <img 
              src={heroImages[currentIndex].src}
              alt={heroImages[currentIndex].alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/70 via-transparent to-emerald-500/30" />
            
            {/* Floating card with current image info - responsive */}
            <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 bg-gradient-to-br from-emerald-500/20 to-emerald-800/30 backdrop-blur-lg p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl border border-emerald-400/30 shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1 sm:p-2 bg-emerald-500/20 rounded-md sm:rounded-lg">
                  {heroImages[currentIndex].icon}
                </div>
                <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-white">
                  {heroImages[currentIndex].title}
                </h3>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Sparkle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300" />
                <span className="text-emerald-100 text-xs sm:text-sm">
                  Innovation in progress
                </span>
              </div>
            </div>
          </div>

          {/* Navigation buttons - responsive sizing */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/30 transition-all duration-200 shadow-lg hover:shadow-emerald-400/20 group w-8 h-8 sm:w-10 sm:h-10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/30 transition-all duration-200 shadow-lg hover:shadow-emerald-400/20 group w-8 h-8 sm:w-10 sm:h-10"
            onClick={goToNext}
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        {/* Enhanced dots indicator - responsive */}
        <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8 gap-2 sm:gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className="flex flex-col items-center group"
              onClick={() => goToSlide(index)}
            >
              <div className="relative w-8 sm:w-10 lg:w-12 h-0.5 sm:h-1 bg-emerald-400/20 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-300 ${
                    index === currentIndex ? "w-full opacity-100" : "w-0 opacity-50"
                  }`}
                />
              </div>
              <div
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1 sm:mt-2 transition-all duration-300 ${
                  index === currentIndex 
                    ? "bg-emerald-400 scale-150" 
                    : "bg-emerald-400/30 group-hover:bg-emerald-400/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Floating tech elements - responsive and simplified for mobile */}
        {!isMobile && (
          <>
            <div className="absolute -top-4 sm:-top-6 -right-4 sm:-right-6 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-emerald-400/10 rounded-xl sm:rounded-2xl backdrop-blur-lg border border-emerald-300/30 flex items-center justify-center animate-float-slow">
              <span className="text-emerald-300 text-lg sm:text-2xl lg:text-3xl">✨</span>
            </div>
            
            <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-24 h-16 sm:w-32 sm:h-20 lg:w-40 lg:h-24 bg-white/10 rounded-xl sm:rounded-2xl backdrop-blur-lg border border-emerald-300/30 p-2 sm:p-3 lg:p-4 animate-float-medium">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-emerald-100 text-xs sm:text-sm font-medium">Live Metrics</div>
              </div>
              <div className="flex justify-between items-center mt-0.5 sm:mt-1">
                <div className="text-white text-sm sm:text-lg font-bold">98%</div>
                <div className="text-xs text-emerald-300 bg-emerald-900/30 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  +2.4%
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
