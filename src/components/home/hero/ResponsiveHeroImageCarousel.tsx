import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkle, Zap, Users, Code, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image1 from "@/assets/hero-2.png";
import Image2 from "@/assets/hero-3.png";
import Image3 from "@/assets/image1.jpg";
import { useWindowSize } from "@/hooks/useWindowSize";

const heroImages = [
  {
    src: Image1,
    alt: "Innovation and technology",
    icon: <Zap className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Cutting-Edge Technology",
    description: "Explore the latest technological advancements"
  },
  {
    src: Image2,
    alt: "Team collaboration",
    icon: <Users className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Collaborative Teams",
    description: "Join forces with like-minded innovators"
  },
  {
    src: Image3,
    alt: "Creative workspace",
    icon: <Lightbulb className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Creative Spaces",
    description: "Foster innovation in inspiring environments"
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Coding and development",
    icon: <Code className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Code The Future",
    description: "Develop solutions that shape tomorrow"
  }
];

interface ResponsiveHeroImageCarouselProps {
  isVisible: boolean;
  isMobile?: boolean;
  fullScreenMode?: boolean;
}

export default function ResponsiveHeroImageCarousel({ 
  isVisible, 
  isMobile,
  fullScreenMode = false
}: ResponsiveHeroImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { height: windowHeight } = useWindowSize();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Calculate dynamic height based on viewport
  const calculateHeight = () => {
    if (fullScreenMode) return `${windowHeight}px`;
    if (isMobile) return `min(80vh, ${windowHeight ? windowHeight * 0.8 : 500}px)`;
    return "500px";
  };

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }
    }, isMobile ? 4000 : 5000);
  };

  useEffect(() => {
    startInterval();
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [isMobile, isHovered]);

  const resetInterval = () => {
    intervalRef.current && clearInterval(intervalRef.current);
    startInterval();
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    resetInterval();
  };

  return (
    <div 
      ref={carouselRef}
      className={`relative w-full max-w-[2000px] mx-auto transition-all duration-700 delay-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: calculateHeight() }}
    >
      <div className="relative w-full h-full">
        {/* Main Carousel Image */}
        <div className="relative w-full h-full rounded-xl lg:rounded-3xl overflow-hidden border border-emerald-400/20 shadow-2xl group">
          <img 
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/60 via-emerald-800/20 to-emerald-500/10" />

          {/* Content Card */}
          <div className={`absolute ${
            isMobile ? 'bottom-4 left-4 p-4' : 'bottom-8 left-8 p-6'
          } bg-gradient-to-br from-emerald-500/20 to-emerald-800/30 backdrop-blur-lg rounded-xl border border-emerald-400/30 shadow-xl transition-all duration-300 transform group-hover:scale-[1.02] max-w-[90%] ${
            isMobile ? 'sm:max-w-xs' : 'sm:max-w-md'
          }`}>
            <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-400/30 flex-shrink-0">
                {heroImages[currentIndex].icon}
              </div>
              <div>
                <h3 className={`font-bold text-white ${
                  isMobile ? 'text-lg' : 'text-xl lg:text-2xl'
                }`}>
                  {heroImages[currentIndex].title}
                </h3>
                <p className={`text-emerald-100/90 mt-1 ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}>
                  {heroImages[currentIndex].description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 animate-spin-slow" />
                <div className="absolute inset-0 rounded-full bg-emerald-300/20 animate-ping-slow" />
              </div>
              <span className="text-emerald-100 text-xs sm:text-sm font-medium">
                Innovation in progress
              </span>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/40 transition-all duration-200 shadow-lg hover:shadow-emerald-400/30 group ${
              isMobile ? 'w-10 h-10' : 'w-12 h-12 lg:w-14 lg:h-14'
            }`}
            onClick={() => {
              setCurrentIndex(currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1);
              resetInterval();
            }}
          >
            <ChevronLeft className={`${
              isMobile ? 'w-5 h-5' : 'w-6 h-6 lg:w-7 lg:h-7'
            } group-hover:scale-110 transition-transform`} />
          </Button>

          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/40 transition-all duration-200 shadow-lg hover:shadow-emerald-400/30 group ${
              isMobile ? 'w-10 h-10' : 'w-12 h-12 lg:w-14 lg:h-14'
            }`}
            onClick={() => {
              setCurrentIndex((currentIndex + 1) % heroImages.length);
              resetInterval();
            }}
          >
            <ChevronRight className={`${
              isMobile ? 'w-5 h-5' : 'w-6 h-6 lg:w-7 lg:h-7'
            } group-hover:scale-110 transition-transform`} />
          </Button>
        </div>

        {/* Indicators */}
        <div className={`flex justify-center ${
          isMobile ? 'mt-4 gap-3' : 'mt-6 gap-4'
        }`}>
          {heroImages.map((image, index) => (
            <button
              key={index}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => goToSlide(index)}
            >
              <div className={`relative ${
                isMobile ? 'w-10 h-1' : 'w-12 h-1.5'
              } bg-emerald-400/20 rounded-full overflow-hidden`}>
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500 ${
                    index === currentIndex ? "w-full" : "w-0"
                  }`}
                />
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <div
                  className={`${
                    isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'
                  } rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-300 scale-125 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                      : "bg-emerald-400/30 group-hover:bg-emerald-400/50"
                  }`}
                />
                {!isMobile && (
                  <span className={`text-xs sm:text-sm font-medium transition-all ${
                    index === currentIndex ? "text-white" : "text-emerald-400/60 group-hover:text-emerald-400/80"
                  }`}>
                    {image.title.split(' ')[0]}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}