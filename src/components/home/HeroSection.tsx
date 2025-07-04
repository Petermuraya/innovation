
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Zap, Rocket, Code2, Brain } from "lucide-react";
import Image1 from "@/assets/hero-2.png";
import Image2 from "@/assets/hero-3.png";
import Image3 from "@/assets/image1.jpg";

const heroImages = [
  {
    src: Image1,
    alt: "Innovation and technology",
    title: "Cutting-Edge Technology",
    description: "Explore the latest technological advancements",
    theme: "emerald"
  },
  {
    src: Image2,
    alt: "Team collaboration",
    title: "Collaborative Innovation",
    description: "Join forces with like-minded innovators",
    theme: "cyan"
  },
  {
    src: Image3,
    alt: "Creative workspace",
    title: "Creative Excellence",
    description: "Foster innovation in inspiring environments",
    theme: "purple"
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Coding and development",
    title: "Code The Future",
    description: "Develop solutions that shape tomorrow",
    theme: "orange"
  }
];

const floatingElements = [
  { icon: Code2, delay: 0, position: "top-20 left-[10%]" },
  { icon: Brain, delay: 1000, position: "top-32 right-[15%]" },
  { icon: Rocket, delay: 2000, position: "bottom-40 left-[20%]" },
  { icon: Zap, delay: 1500, position: "bottom-32 right-[10%]" },
];

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const isMobile = windowWidth < 640;
  const currentTheme = heroImages[currentIndex].theme;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

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

  const getThemeColors = (theme: string) => {
    const themes = {
      emerald: {
        primary: "from-emerald-400 to-emerald-500",
        secondary: "from-emerald-500 to-emerald-600",
        accent: "from-emerald-400/20 to-emerald-500/20",
        glow: "shadow-emerald-500/40"
      },
      cyan: {
        primary: "from-cyan-400 to-cyan-500",
        secondary: "from-cyan-500 to-cyan-600",
        accent: "from-cyan-400/20 to-cyan-500/20",
        glow: "shadow-cyan-500/40"
      },
      purple: {
        primary: "from-purple-400 to-purple-500",
        secondary: "from-purple-500 to-purple-600",
        accent: "from-purple-400/20 to-purple-500/20",
        glow: "shadow-purple-500/40"
      },
      orange: {
        primary: "from-orange-400 to-orange-500",
        secondary: "from-orange-500 to-orange-600",
        accent: "from-orange-400/20 to-orange-500/20",
        glow: "shadow-orange-500/40"
      }
    };
    return themes[theme as keyof typeof themes] || themes.emerald;
  };

  const colors = getThemeColors(currentTheme);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Futuristic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)]" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => {
        const Icon = element.icon;
        return (
          <div
            key={index}
            className={`absolute ${element.position} hidden lg:block animate-float`}
            style={{ animationDelay: `${element.delay}ms` }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-kic-green-400/20 to-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-kic-green-300/30">
              <Icon className="w-6 h-6 text-kic-green-400" />
            </div>
          </div>
        );
      })}

      {/* Main Content */}
      <div 
        className="relative min-h-screen flex items-center justify-center transition-all duration-1000"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            className="w-full h-full object-cover transition-all duration-1000 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-6xl mx-auto">
            
            {/* Status Badge */}
            <div className={`mb-8 transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              <Badge className={`bg-gradient-to-r ${colors.primary} text-white border-0 px-6 py-2 text-sm font-semibold shadow-lg ${colors.glow} animate-pulse`}>
                <Sparkles className="w-4 h-4 mr-2" />
                Next-Gen Innovation Hub
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <span className="block mb-2">
                <span className="text-white">Shape</span>{' '}
                <span className={`bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent animate-pulse`}>
                  Tomorrow
                </span>
              </span>
              <span className="block text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Through{' '}
                <span className={`bg-gradient-to-r ${colors.secondary} bg-clip-text text-transparent`}>
                  Innovation
                </span>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className={`text-xl sm:text-2xl md:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              Join Kenya's most dynamic{' '}
              <span className="text-kic-green-400 font-semibold">tech community</span>{' '}
              where brilliant minds collaborate to build the future.
            </p>
            
            {/* Feature Highlights */}
            <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              {['AI & Machine Learning', 'Blockchain', 'IoT Innovation', 'Web3 Development'].map((tech, index) => (
                <Badge key={index} variant="outline" className="bg-white/10 text-gray-300 border-gray-600 px-4 py-2 hover:bg-white/20 transition-colors">
                  {tech}
                </Badge>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-700 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <Button 
                size="lg"
                asChild
                className={`group relative bg-gradient-to-r ${colors.secondary} hover:${colors.primary} text-white px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl font-bold rounded-2xl shadow-2xl ${colors.glow} transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-white/20 min-w-[200px]`}
              >
                <Link to="/register">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <Rocket className="mr-3 w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform" />
                  Join Revolution
                  <ArrowRight className="ml-3 w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg"
                variant="outline" 
                asChild
                className="group bg-transparent border-2 border-gray-400 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl font-bold rounded-2xl shadow-xl backdrop-blur-sm transition-all duration-300 min-w-[200px]"
              >
                <Link to="/about">
                  <Brain className="mr-3 w-5 h-5 lg:w-6 lg:h-6 group-hover:animate-pulse" />
                  Explore Vision
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 transition-all duration-700 delay-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              {[
                { number: "500+", label: "Innovators" },
                { number: "50+", label: "Projects" },
                { number: "15+", label: "Partners" },
                { number: "30+", label: "Events" }
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-3xl lg:text-4xl font-black mb-2 bg-gradient-to-r ${colors.primary} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {!isMobile && (
          <>
            <Button
              variant="ghost"
              size="lg"
              className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 shadow-lg group w-14 h-14 rounded-full"
              onClick={() => setCurrentIndex(currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1)}
            >
              <ChevronLeft className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 shadow-lg group w-14 h-14 rounded-full"
              onClick={() => setCurrentIndex((currentIndex + 1) % heroImages.length)}
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
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? `bg-gradient-to-br ${colors.primary} scale-125 shadow-lg ${colors.glow}`
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
}
