
import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import CommunitiesSection from "@/components/home/CommunitiesSection";
import StatsSection from "@/components/home/StatsSection";

const Index = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <FeaturedProjects />
      <UpcomingEvents />
      <CommunitiesSection />
    </div>
  );
};

export default Index;
