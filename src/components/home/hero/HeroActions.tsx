
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroActionsProps {
  isVisible: boolean;
}

export default function HeroActions({ isVisible }: HeroActionsProps) {
  return (
    <div 
      className={`flex flex-col sm:flex-row gap-6 transition-all duration-700 delay-400 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <Button 
        size="lg" 
        asChild
        className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-7 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-green-500/40 transition-all duration-300 overflow-hidden border-2 border-green-400/30"
      >
        <Link to="/register">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Sparkles className="mr-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
          Join Our Community
          <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
      
      <Button 
        size="lg" 
        variant="outline" 
        asChild
        className="group bg-gradient-to-r from-yellow-500/10 to-green-500/10 backdrop-blur-sm border-2 border-yellow-400/50 text-yellow-200 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-green-500/20 hover:border-yellow-300 px-10 py-7 text-lg font-bold rounded-2xl shadow-xl hover:shadow-yellow-400/25 transition-all duration-300"
      >
        <Link to="/about">
          Learn More About Us
        </Link>
      </Button>
    </div>
  );
}
