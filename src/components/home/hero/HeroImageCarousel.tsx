
import ResponsiveHeroImageCarousel from "./ResponsiveHeroImageCarousel";

interface HeroImageCarouselProps {
  isVisible: boolean;
  isMobile?: boolean;
}

export default function HeroImageCarousel({ isVisible, isMobile }: HeroImageCarouselProps) {
  return <ResponsiveHeroImageCarousel isVisible={isVisible} isMobile={isMobile} />;
}
