
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import HeroOverlays from "./hero/HeroOverlays";
import HeroLogo from "./hero/HeroLogo";
import HeroHeadline from "./hero/HeroHeadline";
import FeatureHighlights from "./hero/FeatureHighlights";
import HeroVisual from "./hero/HeroVisual";
import WaveSeparator from "./hero/WaveSeparator";

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
      {/* Background overlays */}
      <HeroOverlays scrollY={scrollY} />
      
      {/* Hero content */}
      <div className="relative container-custom pt-8 md:pt-16 lg:pt-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text content - spans 5 columns on large screens */}
          <div className="lg:col-span-5 text-center lg:text-left z-10">
            {/* Club logo or identifier */}
            <HeroLogo isVisible={isVisible.title} />
            
            {/* Headline, subtitle, and buttons */}
            <HeroHeadline 
              isVisible={{
                title: isVisible.title,
                subtitle: isVisible.subtitle,
                buttons: isVisible.buttons
              }}
              scrollToNextSection={scrollToNextSection}
            />

            {/* Community highlights */}
            <FeatureHighlights isVisible={isVisible.features} />
          </div>
          
          {/* Visual content */}
          <HeroVisual isVisible={isVisible.image} />
        </div>

        {/* Wave separator */}
        <WaveSeparator scrollY={scrollY} />
      </div>
    </section>
  );
}
