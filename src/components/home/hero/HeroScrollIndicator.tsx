
import { ChevronDown } from "lucide-react";

interface HeroScrollIndicatorProps {
  scrollToNextSection: () => void;
}

export default function HeroScrollIndicator({ scrollToNextSection }: HeroScrollIndicatorProps) {
  return (
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
  );
}
