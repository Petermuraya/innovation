
import { Star } from "lucide-react";
import { TypingEffect } from "@/components/ui/typing-effect";

interface HeroTextProps {
  isVisible: boolean;
  typingWords: string[];
}

export default function HeroText({ isVisible, typingWords }: HeroTextProps) {
  return (
    <div className="space-y-8">
      {/* Enhanced Badge with brand colors */}
      <div 
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-yellow-500/20 border-2 border-green-400/40 backdrop-blur-sm shadow-lg transition-all duration-700 hover:shadow-green-400/25 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
        <span className="text-green-100 text-sm font-semibold tracking-wide">Karatina University Innovation Club</span>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>

      {/* Enhanced Headline with Typing Effect */}
      <div 
        className={`space-y-6 transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <h1 className="text-5xl lg:text-8xl font-bold leading-tight">
          <span className="block text-white drop-shadow-lg">Revealing the</span>
          <span className="block text-white drop-shadow-lg">Treasures of</span>
          <span className="block bg-gradient-to-r from-green-300 via-yellow-300 to-green-400 bg-clip-text text-transparent filter drop-shadow-2xl">
            <TypingEffect 
              words={typingWords}
              className="inline-block min-h-[1.2em]"
              typingSpeed={120}
              deletingSpeed={80}
              pauseDuration={2500}
            />
          </span>
        </h1>
        <p className="text-xl lg:text-2xl text-green-50/95 max-w-2xl leading-relaxed font-medium">
          Dream, Create and Inspire for a Better Future. Join our community of innovators 
          <span className="text-yellow-300 font-semibold"> shaping tomorrow's technology</span>.
        </p>
      </div>
    </div>
  );
}
