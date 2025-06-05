import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeroHeadlineProps {
  isVisible: {
    title: boolean;
    subtitle: boolean;
    buttons: boolean;
  };
  scrollToNextSection: () => void;
}

export const HeroHeadline = ({ isVisible, scrollToNextSection }: HeroHeadlineProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#2c7a4d]/10 rounded-full filter blur-3xl opacity-70 animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2c7a4d]/05 rounded-full filter blur-3xl opacity-50 animate-float-delay" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-20 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDQsIDIwNCwgMjA0LCAwLjMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
      
      <div 
        className={`transition-all duration-700 delay-100 transform ${
          isVisible.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="font-bold mb-4 leading-tight text-white">
          <span className="block text-white text-xl md:text-2xl font-light tracking-widest mb-2">
            REVEALING THE
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2c7a4d] to-[#4fd1c5] text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            TREASURES OF INNOVATION
          </span>
        </h1>
      </div>
      
      <div 
        className={`transition-all duration-700 delay-200 transform ${
          isVisible.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-lg md:text-xl text-[#fefefe] mb-8 max-w-xl mx-auto lg:mx-0 font-light relative">
          <span className="absolute -left-6 top-1 text-[#2c7a4d]">
            <Sparkles size={16} />
          </span>
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
          className="gap-2 px-8 relative overflow-hidden group bg-gradient-to-r from-[#2c7a4d] to-[#4fd1c5] hover:from-[#2c7a4d]/90 hover:to-[#4fd1c5]/90 text-white font-medium tracking-wide rounded-lg shadow-lg hover:shadow-[#2c7a4d]/30 transition-all duration-300"
          asChild
        >
          <Link to="/register">
            <span className="relative z-10 flex items-center">
              Get Involved
              <span className="ml-2 h-3 w-3 rounded-full bg-white/80 animate-pulse" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-[#2c7a4d]/80 to-[#4fd1c5]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </Button>
        
        <Button 
          size="lg" 
          variant="outline" 
          className="gap-2 group border-2 border-[#2c7a4d] text-[#2c7a4d] hover:bg-[#2c7a4d]/10 relative overflow-hidden px-8 rounded-lg font-medium tracking-wide transition-all duration-300"
          asChild
        >
          <Link to="/about">
            <span className="relative z-10">Learn More</span>
            <span className="absolute inset-0 w-0 bg-[#2c7a4d]/10 group-hover:w-full transition-all duration-300 ease-in-out" />
          </Link>
        </Button>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div 
        className="mt-16 hidden md:flex justify-center lg:justify-start"
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <button 
          onClick={scrollToNextSection} 
          className="flex flex-col items-center group"
        >
          <span className="text-sm mb-3 text-[#fefefe]/70 group-hover:text-[#2c7a4d] transition-colors tracking-widest">
            EXPLORE MORE
          </span>
          <div className="relative w-8 h-12 rounded-full border-2 border-[#2c7a4d]/50 flex items-center justify-center group-hover:border-[#2c7a4d] transition-colors">
            <motion.div
              animate={{
                y: [0, 8, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-1 h-3 rounded-full bg-[#2c7a4d]"
            />
          </div>
        </button>
      </motion.div>
    </div>
  );
};

export default HeroHeadline;