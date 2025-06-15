
import { ChevronDown, MousePointer } from "lucide-react";

interface HeroScrollIndicatorProps {
  scrollToNextSection: () => void;
}

export default function HeroScrollIndicator({ scrollToNextSection }: HeroScrollIndicatorProps) {
  return (
    <div className="flex justify-center mt-20">
      <button 
        onClick={scrollToNextSection}
        className="group flex flex-col items-center text-green-200 hover:text-green-100 transition-all duration-300 transform hover:scale-105"
        aria-label="Scroll to next section"
      >
        <div className="relative mb-4">
          <div className="w-6 h-10 border-2 border-green-300/60 rounded-full relative overflow-hidden">
            <div className="w-1 h-3 bg-gradient-to-b from-green-400 to-yellow-400 rounded-full absolute left-1/2 top-2 transform -translate-x-1/2 animate-bounce" />
          </div>
          <MousePointer className="w-4 h-4 absolute -right-2 -top-1 text-yellow-400 opacity-70 animate-pulse" />
        </div>
        
        <span className="text-sm font-semibold mb-3 tracking-wide">Explore More</span>
        
        <div className="relative">
          <ChevronDown className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-b from-green-400/20 to-yellow-400/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
        </div>
        
        {/* Animated indicator line */}
        <div className="w-px h-8 bg-gradient-to-b from-green-400 to-transparent mt-2 opacity-60" />
      </button>
    </div>
  );
}
