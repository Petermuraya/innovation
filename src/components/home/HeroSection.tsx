import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Rocket, Plane, Lightbulb, Globe, Leaf, Palette, Calendar, MapPin, ArrowRight } from "lucide-react";
import Image1 from "@/assets/hero-2.png";
import Image2 from "@/assets/hero-3.png";
import Image3 from "@/assets/image1.jpg";
import "./HeroSection.css";

const heroImages = [
  {
    src: Image1,
    alt: "Innovation and technology",
    title: "Dream Big",
    description: "Imagine the possibilities of a sustainable future",
    gradient: "from-emerald-500 to-amber-400"
  },
  {
    src: Image2,
    alt: "Team collaboration",
    title: "Create Together",
    description: "Collaborative solutions for global challenges",
    gradient: "from-amber-500 to-emerald-400"
  },
  {
    src: Image3,
    alt: "Creative Workspace",
    title: "Inspire Change",
    description: "Spark ideas that transform communities",
    gradient: "from-purple-500 to-teal-400"
  },
  {
    src: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
    alt: "Coding and development",
    title: "Build Tomorrow",
    description: "Innovative technologies for a circular economy",
    gradient: "from-blue-500 to-cyan-400"
  },
];

const floatingElements = [
  { icon: Lightbulb, delay: 0, position: "top-20 left-[10%]", text: "Dream", color: "text-amber-300" },
  { icon: Palette, delay: 1500, position: "top-32 right-[12%]", text: "Create", color: "text-emerald-300" },
  { icon: Globe, delay: 3000, position: "bottom-36 left-[15%]", text: "Impact", color: "text-blue-300" },
  { icon: Leaf, delay: 4500, position: "bottom-24 right-[18%]", text: "Sustain", color: "text-teal-300" },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = windowWidth < 768;
  const intervalRef = useRef<NodeJS.Timeout>();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotate images with smooth transitions
  useEffect(() => {
    const changeSlide = (direction: 'next' | 'prev' = 'next') => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(prev => 
          direction === 'next' 
            ? (prev + 1) % heroImages.length 
            : (prev - 1 + heroImages.length) % heroImages.length
        );
        setTimeout(() => setIsAnimating(false), 500);
      }, 500);
    };

    intervalRef.current = setInterval(() => {
      if (!isHovered) changeSlide('next');
    }, isMobile ? 6000 : 8000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isMobile, isHovered]);

  const handleImageClick = (index: number) => {
    if (index === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    }, 500);
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${heroImages[currentIndex].gradient} opacity-90 transition-all duration-1000 ease-in-out`} />
        <img
          src={heroImages[currentIndex].src}
          alt={heroImages[currentIndex].alt}
          className={`w-full h-full object-cover opacity-30 transition-all duration-1000 ease-in-out ${isAnimating ? 'scale-110 opacity-20' : 'scale-100 opacity-30'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element, index) => {
        const Icon = element.icon;
        return (
          <div
            key={index}
            className={`absolute ${element.position} hidden lg:flex flex-col items-center animate-float`}
            style={{ animationDelay: `${element.delay}ms` }}
          >
            <div className={`w-14 h-14 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20 shadow-lg hover:scale-110 transition-all duration-300 group`}>
              <Icon className={`w-6 h-6 ${element.color} group-hover:scale-125 transition-transform`} />
            </div>
            <span className="mt-2 text-xs font-semibold text-white/80 tracking-wider bg-black/20 px-2 py-1 rounded-full">
              {element.text}
            </span>
          </div>
        );
      })}

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-particle"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="lg:w-[55%] space-y-6 text-center lg:text-left">
            <div className="inline-flex">
              <Badge 
                className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-500 text-gray-900 border-0 px-5 py-2 text-sm font-medium shadow-lg shadow-amber-400/30 hover:shadow-emerald-500/40 transition-all duration-500 group"
                variant="outline"
              >
                <Sparkles className="w-4 h-4 mr-2 animate-pulse group-hover:rotate-180 transition-transform" />
                <span className="group-hover:scale-105 transition-transform">Dream • Create • Inspire</span>
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                Imagine
              </span>{" "}
              the Future,{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                Build
              </span>{" "}
              the Change
            </h1>

            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-2xl">
              Where visionary ideas meet actionable solutions. Join us at Karatina Innovation Hub to co-create a sustainable tomorrow through circular economy innovation.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-white/80">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Calendar className="w-5 h-5 mr-2 text-amber-300" />
                <span>15 – 17 September 2025</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPin className="w-5 h-5 mr-2 text-blue-300" />
                <span>Karatina University</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
              <Link to="/register">
                <Button 
                  className="px-8 py-6 text-white font-semibold rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-gray-900 hover:from-emerald-600 hover:via-amber-600 hover:to-black shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-500 border-2 border-white/20 hover:border-white/30 group relative overflow-hidden"
                  size="lg"
                >
                  <span className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-emerald-500 via-amber-500 to-gray-900 group-hover:animate-wave transition-all duration-1000" />
                  <span className="absolute left-0 top-0 w-full h-full bg-white opacity-0 group-active:opacity-20 group-active:animate-planeTakeoff transition-opacity" />
                  <span className="relative z-10 flex items-center">
                    <Rocket className="w-5 h-5 mr-2 group-hover:translate-x-1 group-active:translate-x-[200%] group-active:opacity-0 transition-all duration-700" />
                    <span className="group-active:translate-x-4 transition-transform">Join the Movement</span>
                  </span>
                </Button>
              </Link>
              
              <Link to="/projects">
                <Button 
                  variant="outline" 
                  className="px-8 py-6 font-semibold rounded-full bg-white/10 text-white hover:bg-white/20 shadow-md hover:shadow-white/10 transition-all duration-300 border-2 border-white/20 hover:border-white/30 group"
                  size="lg"
                >
                  <span className="flex items-center">
                    Explore Innovations
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="lg:w-[42%] grid grid-cols-2 gap-4">
            {heroImages.map((img, index) => (
              <div
                key={index}
                className={`bg-white/5 p-3 rounded-2xl shadow-xl flex flex-col items-center backdrop-blur-md border-2 transition-all duration-500 hover:scale-[1.03] cursor-pointer group overflow-hidden ${
                  currentIndex === index 
                    ? 'border-amber-400/70 shadow-amber-400/20' 
                    : 'border-white/20 hover:border-white/30'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => handleImageClick(index)}
              >
                <div className="relative overflow-hidden rounded-lg w-full aspect-square mb-3">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                      currentIndex === index ? 'opacity-100' : 'opacity-80'
                    }`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity ${
                    currentIndex === index ? 'opacity-80' : 'opacity-60'
                  }`} />
                </div>
                <h3 className="text-md font-bold text-white text-center">{img.title}</h3>
                <p className="text-xs text-white/70 text-center mt-1">{img.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce-slow hidden sm:block">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-amber-400 to-emerald-400 rounded-full mt-2 animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
}