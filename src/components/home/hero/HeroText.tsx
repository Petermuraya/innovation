
import { Star } from "lucide-react";
import { TypingEffect } from "@/components/ui/typing-effect";

interface HeroTextProps {
  isVisible: boolean;
  typingWords: string[];
}

export default function HeroText({ isVisible, typingWords }: HeroTextProps) {
  return (
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
    </div>
  );
}
