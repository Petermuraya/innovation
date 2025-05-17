
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveIn, FadeIn } from "@/components/ui/animations";
import { ChevronDown, Users, Code, Lightbulb } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import InnovationCube from "./InnovationCube";

export default function HeroSection() {
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({
    title: false,
    subtitle: false,
    buttons: false,
    features: false,
    image: false
  });

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Trigger animations as soon as component mounts
    const timer = setTimeout(() => {
      setIsVisible({
        title: true,
        subtitle: true,
        buttons: true,
        features: true,
        image: true
      });
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Scroll to next section
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("stats-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pb-16 md:pb-24 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Dynamic overlays and patterns */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid z-0" 
        style={{ transform: `translateY(${scrollY * 0.02}px)` }}
      />
      
      <div className="absolute inset-0 pattern-bg opacity-5 z-0 rotate-180" />
      
      {/* Floating gold particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-[#b28d49]/10 animate-float-slow" 
             style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-[#b28d49]/5 animate-float-medium" 
             style={{ transform: `translateY(${scrollY * -0.05}px)` }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-[#fefefe]/10 animate-float-fast" 
             style={{ transform: `translateY(${scrollY * 0.08}px)` }} />
      </div>
      
      {/* Gold accent line */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#b28d49]/80 via-[#b28d49]/30 to-transparent" />
      
      {/* Hero content */}
      <div className="relative container-custom pt-8 md:pt-16 lg:pt-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text content - spans 5 columns on large screens */}
          <div className="lg:col-span-5 text-center lg:text-left z-10">
            {/* Club logo or identifier */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b28d49]/20 text-[#b28d49] mb-8 transition-all duration-500 transform ${
                isVisible.title ? "opacity-100" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-white font-bold">K</span>
                <span className="text-[#b28d49]">IC</span>
              </div>
              <span className="text-sm font-medium text-[#fefefe]">Karatina Innovation Club</span>
            </div>
            
            <div 
              className={`transition-all duration-700 delay-100 transform ${
                isVisible.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="font-bold mb-4 leading-tight text-[#ffffff]">
                <span className="block text-[#ffffff]">Revealing the</span>
                <span className="text-[#b28d49]">Treasures of Innovation</span>
              </h1>
            </div>
            
            <div 
              className={`transition-all duration-700 delay-200 transform ${
                isVisible.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-lg md:text-xl text-[#fefefe] mb-8 max-w-xl mx-auto lg:mx-0 font-light">
                Dream, Create and Inspire for a Better Future
              </p>
            </div>
            
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-300 transform ${
                isVisible.buttons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Button 
                size="lg" 
                className="gap-2 px-6 relative overflow-hidden group bg-[#b28d49] hover:bg-[#b28d49]/90 text-white" 
                asChild
              >
                <Link to="/register">
                  Get Involved
                  <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2 group border-[#b28d49] text-[#b28d49] hover:bg-[#b28d49]/10 relative overflow-hidden" 
                asChild
              >
                <Link to="/about">
                  Learn More
                  <span className="absolute inset-0 w-0 bg-[#b28d49]/10 group-hover:w-full transition-all duration-300" />
                </Link>
              </Button>
            </div>

            {/* Community highlights with enhanced animations */}
            <div 
              className={`grid grid-cols-1 md:grid-cols-3 gap-3 mt-10 transition-all duration-700 delay-400 transform ${
                isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-[#b28d49]/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#b28d49]/40">
                <div className="flex items-center gap-3">
                  <div className="bg-[#b28d49]/20 p-2 rounded-full">
                    <Users size={18} className="text-[#b28d49]" />
                  </div>
                  <p className="font-medium text-sm text-left text-[#fefefe]">Tech Community</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-[#b28d49]/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#b28d49]/40">
                <div className="flex items-center gap-3">
                  <div className="bg-[#b28d49]/20 p-2 rounded-full">
                    <Code size={18} className="text-[#b28d49]" />
                  </div>
                  <p className="font-medium text-sm text-left text-[#fefefe]">Code & Create</p>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-[#b28d49]/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#b28d49]/40">
                <div className="flex items-center gap-3">
                  <div className="bg-[#b28d49]/20 p-2 rounded-full">
                    <Lightbulb size={18} className="text-[#b28d49]" />
                  </div>
                  <p className="font-medium text-sm text-left text-[#fefefe]">Ideation Hub</p>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="mt-10 hidden md:flex justify-center lg:justify-start">
              <button 
                onClick={scrollToNextSection} 
                className="flex flex-col items-center text-[#fefefe]/70 hover:text-[#b28d49] transition-colors"
              >
                <span className="text-sm mb-1">Explore More</span>
                <ChevronDown className="animate-bounce" size={20} />
              </button>
            </div>
          </div>
          
          {/* Visual content - spans 7 columns on large screens */}
          <div 
            className={`lg:col-span-7 z-10 transition-all duration-700 delay-500 transform ${
              isVisible.image ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            <div className="relative rounded-xl overflow-hidden border border-[#b28d49]/30 shadow-2xl">
              {/* Main visual with innovative glass panels */}
              <div className="relative aspect-[16/9] md:aspect-[16/10] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
                {/* Futuristic figure silhouette */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                    alt="Innovation figure"
                    className="object-cover w-full h-full opacity-60"
                  />
                </div>
                
                {/* Dynamic glowing lines */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100,50 Q200,150 300,100 T500,100" stroke="#b28d49" strokeWidth="2" fill="none" className="animate-float-slow" />
                  <path d="M50,200 Q150,50 250,200 T450,200" stroke="#ffffff" strokeWidth="1" strokeDasharray="5,5" fill="none" className="animate-float-medium" />
                  <path d="M200,400 Q300,200 400,400" stroke="#b28d49" strokeWidth="1.5" fill="none" className="animate-float-fast" />
                </svg>
                
                {/* Floating glass panels */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rotate-6 animate-float-medium">
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-[#b28d49]/30 w-36 h-24">
                    <p className="text-[#fefefe] text-xs font-medium mb-1">Prototype Tests</p>
                    <div className="h-10 flex items-end gap-1">
                      {[1, 4, 2, 6, 3, 5, 7].map((h, i) => (
                        <div 
                          key={i}
                          className="w-2 bg-gradient-to-t from-[#b28d49] to-[#ffffff]" 
                          style={{ height: `${h * 10}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 -rotate-3 animate-float-slow">
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-[#b28d49]/30 w-36 h-24">
                    <p className="text-[#fefefe] text-xs font-medium mb-1">Innovation Metrics</p>
                    <svg className="h-10 w-full" viewBox="0 0 100 20">
                      <path d="M0,10 Q10,5 20,10 T40,15 T60,5 T80,10 T100,5" stroke="#b28d49" strokeWidth="1" fill="none" />
                    </svg>
                  </div>
                </div>
                
                {/* Interactive innovation cube overlay */}
                <div className="absolute -right-10 -top-10 z-20 opacity-80 hover:opacity-100 transition-opacity hidden lg:block scale-75">
                  <InnovationCube />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator with parallax effect */}
        <div 
          className="absolute bottom-0 left-0 w-full"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-gray-800">
            <path fill="currentColor" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,197.3C672,203,768,213,864,229.3C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
    </section>
  );
}
