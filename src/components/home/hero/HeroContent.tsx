
import HeroText from "./HeroText";
import HeroActions from "./HeroActions";
import HeroFeatures from "./HeroFeatures";
import HeroImageCarousel from "./HeroImageCarousel";

interface HeroContentProps {
  isVisible: boolean;
  typingWords: string[];
  isMobile?: boolean;
}

export default function HeroContent({ isVisible, typingWords, isMobile }: HeroContentProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Text Content - Better responsive spacing */}
        <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
          <HeroText isVisible={isVisible} typingWords={typingWords} isMobile={isMobile} />
          <HeroActions isVisible={isVisible} isMobile={isMobile} />
          <HeroFeatures isVisible={isVisible} isMobile={isMobile} />
        </div>

        {/* Visual Content - Better responsive positioning */}
        <div className="order-1 lg:order-2">
          <HeroImageCarousel isVisible={isVisible} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}
