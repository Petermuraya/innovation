
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-center">
        {/* Visual Content - Now takes more space and comes first */}
        <div className="order-1 lg:col-span-3">
          <HeroImageCarousel isVisible={isVisible} isMobile={isMobile} />
        </div>

        {/* Text Content - Now takes less space */}
        <div className="space-y-6 sm:space-y-8 order-2 lg:col-span-2">
          <HeroText isVisible={isVisible} typingWords={typingWords} isMobile={isMobile} />
          <HeroActions isVisible={isVisible} isMobile={isMobile} />
          <HeroFeatures isVisible={isVisible} isMobile={isMobile} />
        </div>
      </div>
    </div>
  );
}
