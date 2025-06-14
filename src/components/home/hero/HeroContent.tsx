
import HeroText from "./HeroText";
import HeroActions from "./HeroActions";
import HeroFeatures from "./HeroFeatures";
import HeroImageCarousel from "./HeroImageCarousel";

interface HeroContentProps {
  isVisible: boolean;
  typingWords: string[];
}

export default function HeroContent({ isVisible, typingWords }: HeroContentProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div className="space-y-8">
          <HeroText isVisible={isVisible} typingWords={typingWords} />
          <HeroActions isVisible={isVisible} />
          <HeroFeatures isVisible={isVisible} />
        </div>

        {/* Visual Content - Image Carousel */}
        <HeroImageCarousel isVisible={isVisible} />
      </div>
    </div>
  );
}
