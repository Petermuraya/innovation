
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import Image1 from "@/assets/hero-2.png";
import Image2 from "@/assets/hero-3.png";
import Image3 from "@/assets/image1.jpg";
import { useWindowSize } from "@/hooks/useWindowSize";

const heroImages = [
  {
    src: Image1,
    alt: "Innovation and technology",
    title: "Cutting-Edge Technology",
    description: "Explore the latest technological advancements"
  },
  {
    src: Image2,
    alt: "Team collaboration",
    title: "Collaborative Teams",
    description: "Join forces with like-minded innovators"
  },
  {
    src: Image3,
    alt: "Creative workspace",
    title: "Creative Spaces",
    description: "Foster innovation in inspiring environments"
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Coding and development",
    title: "Code The Future",
    description: "Develop solutions that shape tomorrow"
  }
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const isMobile = windowWidth < 640;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
      }
    }, isMobile ? 4000 : 5000);

    return () => clearInterval(interval);
  }, [isMobile, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const calculateHeight = () => {
    if (isMobile) return `min(80vh, ${windowHeight ? windowHeight * 0.8 : 500}px)`;
    return "600px";
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Carousel */}
      <div 
        className={`relative w-full mx-auto transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ height: calculateHeight() }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Carousel Image */}
        <div className="relative w-full h-full">
          <img 
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            className="w-full h-full object-cover transition-transform duration-1000"
            loading="eager"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated Title */}
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Innovate
                </span>{' '}
                <span className="text-white">Your Future</span>
              </h1>
              
              {/* Animated Subtitle */}
              <p className={`text-lg sm:text-xl md:text-2xl text-emerald-100/90 mb-8 sm:mb-12 max-w-3xl mx-auto transition-all duration-700 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                Join a community of forward-thinkers building the next generation of digital solutions.
              </p>
              
              {/* Hero Actions */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center transition-all duration-700 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Button 
                  size={isMobile ? "default" : "lg"}
                  asChild
                  className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-7 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-green-500/40 transition-all duration-300 overflow-hidden border-2 border-green-400/30 w-full sm:w-auto"
                >
                  <Link to="/register">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <Sparkles className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                    Join Our Community
                    <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  size={isMobile ? "default" : "lg"}
                  variant="outline" 
                  asChild
                  className="group bg-gradient-to-r from-yellow-500/10 to-green-500/10 backdrop-blur-sm border-2 border-yellow-400/50 text-yellow-200 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-green-500/20 hover:border-yellow-300 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-7 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-xl hover:shadow-yellow-400/25 transition-all duration-300 w-full sm:w-auto"
                >
                  <Link to="/about">
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {!isMobile && (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/40 transition-all duration-200 shadow-lg hover:shadow-emerald-400/30 group w-14 h-14"
              onClick={() => {
                setCurrentIndex(currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1);
              }}
            >
              <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-emerald-400/30 text-white hover:bg-emerald-500/40 transition-all duration-200 shadow-lg hover:shadow-emerald-400/30 group w-14 h-14"
              onClick={() => {
                setCurrentIndex((currentIndex + 1) % heroImages.length);
              }}
            >
              <ChevronRight className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Button>
          </>
        )}

        {/* Indicators */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-br from-emerald-400 to-emerald-300 scale-125 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  : "bg-emerald-400/30 hover:bg-emerald-400/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
