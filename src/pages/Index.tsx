
import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import CommunitiesSection from "@/components/home/CommunitiesSection";
import StatsSection from "@/components/home/StatsSection";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";

const Index = () => {
  return (
    <div className="flex flex-col w-full bg-kic-lightGray">
      <SEOHead
        title="Home"
        description="Karatina University Innovation Club - Building technology leaders of tomorrow through innovation, collaboration, and cutting-edge projects. Join our community of tech enthusiasts."
        canonical="/"
        keywords={["Karatina University", "innovation club", "technology", "programming", "web development", "AI", "hackathons", "tech community"]}
      />
      
      <StructuredData type="organization" />
      <StructuredData type="webpage" />
      
      <HeroSection />
      <div id="stats-section">
        <StatsSection />
      </div>
      <FeaturedProjects />
      <UpcomingEvents />
      <CommunitiesSection />
    </div>
  );
};

export default Index;
