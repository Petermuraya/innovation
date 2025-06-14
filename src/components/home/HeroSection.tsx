
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroBackground from "./hero/HeroBackground";
import HeroContent from "./hero/HeroContent";
import HeroScrollIndicator from "./hero/HeroScrollIndicator";

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

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
      <HeroBackground scrollY={scrollY} />

      {/* Main Content */}
      <div className="relative z-10 container-custom px-6 py-20">
        <HeroContent isVisible={isVisible} typingWords={typingWords} />
        <HeroScrollIndicator scrollToNextSection={scrollToNextSection} />
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
