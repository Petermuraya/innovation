
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroActionsProps {
  isVisible: boolean;
}

export default function HeroActions({ isVisible }: HeroActionsProps) {
  return (
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
  );
}
