import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkle, Zap, Users, Code, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image1 from "@/assets/hero-2.png";
import Image2 from "@/assets/hero-3.png";
import Image3 from "@/assets/image1.jpg";

const heroImages = [
  {
    src: Image1,
    alt: "Innovation and technology",
    icon: <Zap className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Cutting-Edge Technology",
    description: "Explore the latest technological advancements in our community"
  },
  {
    src: Image2,
    alt: "Team collaboration",
    icon: <Users className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Collaborative Teams",
    description: "Join forces with like-minded innovators and creators"
  },
  {
    src: Image3,
    alt: "Creative workspace",
    icon: <Lightbulb className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Creative Spaces",
    description: "Foster innovation in our inspiring work environments"
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Coding and development",
    icon: <Code className="w-6 h-6 lg:w-8 lg:h-8" />,
    title: "Code The Future",
    description: "Develop solutions that shape tomorrow's world"
  }
];

interface ResponsiveHeroImageCarouselProps {
  isVisible: boolean;
  isMobile?: boolean;
}

export default function ResponsiveHeroImageCarousel({ isVisible, isMobile }: ResponsiveHeroImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

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
      className={`relative w-full max-w-[2000px] mx-auto transition-all duration-700 delay-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full">
        <div className="relative aspect-[16/6] lg:h-[500px] rounded-3xl overflow-hidden border border-emerald-400/20 shadow-2xl group">
          <img 
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/60 via-emerald-800/20 to-emerald-500/10" />

          <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 lg:bottom-16 lg:left-16 bg-gradient-to-br from-emerald-500/20 to-emerald-800/30 backdrop-blur-lg p-5 sm:p-6 lg:p-8 rounded-2xl border border-emerald-400/30 shadow-xl transition-all duration-300 transform group-hover:scale-[1.02] max-w-[90%] sm:max-w-md">
            <div className="flex items-start gap-4 mb-3">
              <div className="p-2.5 bg-emerald-500/20 rounded-lg border border-emerald-400/30 flex-shrink-0">
                {heroImages[currentIndex].icon}
              </div>
              <div>
                <h3 className="text-xl lg:text-3xl font-bold text-white">
                  {heroImages[currentIndex].title}
                </h3>
                <p className="text-base text-emerald-100/90 mt-2 hidden sm:block">
                  {heroImages[currentIndex].description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkle className="w-5 h-5 text-emerald-300 animate-spin-slow" />
                <div className="absolute inset-0 rounded-full bg-emerald-300/20 animate-ping-slow" />
              </div>
              <span className="text-emerald-100 text-sm font-medium">
                Innovation in progress
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/40 transition-all duration-200 shadow-lg hover:shadow-emerald-400/30 group w-12 h-12 lg:w-14 lg:h-14 opacity-100"
            onClick={() => {
              setCurrentIndex(currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1);
              resetInterval();
            }}
          >
            <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/40 transition-all duration-200 shadow-lg hover:shadow-emerald-400/30 group w-12 h-12 lg:w-14 lg:h-14 opacity-100"
            onClick={() => {
              setCurrentIndex((currentIndex + 1) % heroImages.length);
              resetInterval();
            }}
          >
            <ChevronRight className="w-7 h-7 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8 gap-4">
          {heroImages.map((image, index) => (
            <button
              key={index}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => goToSlide(index)}
            >
              <div className="relative w-12 h-1.5 bg-emerald-400/20 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500 ${
                    index === currentIndex ? "w-full" : "w-0"
                  }`}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gradient-to-br from-emerald-400 to-emerald-300 scale-125 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                      : "bg-emerald-400/30 group-hover:bg-emerald-400/50"
                  }`}
                />
                <span className={`text-sm font-medium hidden sm:block transition-all ${
                  index === currentIndex ? "text-white" : "text-emerald-400/60 group-hover:text-emerald-400/80"
                }`}>
                  {image.title.split(' ')[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
