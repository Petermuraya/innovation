
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Users, Code, Lightbulb, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TypingEffect } from "@/components/ui/typing-effect";
import HeroImageCarousel from "./hero/HeroImageCarousel";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const typingWords = [
    "Innovation",
    "Technology",
    "Creativity", 
    "Future",
    "Excellence"
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    // Trigger entrance animations
    const timer = setTimeout(() => setIsVisible(true), 200);
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("stats-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    { icon: Users, title: "Tech Community", description: "Connect with innovators" },
    { icon: Code, title: "Code & Create", description: "Build amazing projects" },
    { icon: Lightbulb, title: "Innovation Hub", description: "Turn ideas into reality" }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
        
        {/* Floating shapes */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container-custom px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                <Star className="w-4 h-4 text-emerald-300 fill-emerald-300" />
                <span className="text-emerald-100 text-sm font-medium">Karatina University Innovation Club</span>
              </div>

              {/* Headline with Typing Effect */}
              <div 
                className={`space-y-6 transition-all duration-700 delay-200 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="block">Revealing the</span>
                  <span className="block">Treasures of</span>
                  <span className="block bg-gradient-to-r from-emerald-300 to-emerald-400 bg-clip-text text-transparent">
                    <TypingEffect 
                      words={typingWords}
                      className="inline-block min-h-[1.2em]"
                      typingSpeed={150}
                      deletingSpeed={100}
                      pauseDuration={2000}
                    />
                  </span>
                </h1>
                <p className="text-xl text-emerald-100/90 max-w-xl leading-relaxed">
                  Dream, Create and Inspire for a Better Future. Join our community of innovators shaping tomorrow's technology.
                </p>
              </div>

              {/* Action Buttons */}
              <div 
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                <Button 
                  size="lg" 
                  asChild
                  className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  <Link to="/register">
                    Join Our Community
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="group border-2 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-300 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                >
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>

              {/* Feature Cards */}
              <div 
                className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 transition-all duration-700 delay-600 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 hover:bg-white/10 hover:border-emerald-300/40 transition-all duration-300"
                  >
                    <feature.icon className="w-6 h-6 text-emerald-300 mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-emerald-100/70">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Content - Image Carousel */}
            <HeroImageCarousel isVisible={isVisible} />
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-16">
            <button 
              onClick={scrollToNextSection}
              className="group flex flex-col items-center text-emerald-200 hover:text-emerald-100 transition-colors"
              aria-label="Scroll to next section"
            >
              <span className="text-sm font-medium mb-2">Explore More</span>
              <ChevronDown className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Seamless bottom wave separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg 
          className="relative block w-full h-24" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}
