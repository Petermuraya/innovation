
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

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
    <>
      <div 
        className={`transition-all duration-700 delay-100 transform ${
          isVisible.title ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="font-bold mb-4 leading-tight text-[#ffffff]">
          <span className="block text-[#ffffff]">Revealing the</span>
          <span className="text-[#2c7a4d]">Treasures of Innovation</span>
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
          className="gap-2 px-6 relative overflow-hidden group bg-[#2c7a4d] hover:bg-[#2c7a4d]/90 text-white" 
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
          className="gap-2 group border-[#2c7a4d] text-[#2c7a4d] hover:bg-[#2c7a4d]/10 relative overflow-hidden" 
          asChild
        >
          <Link to="/about">
            Learn More
            <span className="absolute inset-0 w-0 bg-[#2c7a4d]/10 group-hover:w-full transition-all duration-300" />
          </Link>
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="mt-10 hidden md:flex justify-center lg:justify-start">
        <button 
          onClick={scrollToNextSection} 
          className="flex flex-col items-center text-[#fefefe]/70 hover:text-[#2c7a4d] transition-colors"
        >
          <span className="text-sm mb-1">Explore More</span>
          <ChevronDown className="animate-bounce" size={20} />
        </button>
      </div>
    </>
  );
};

export default HeroHeadline;
