
import { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import CommunitiesSection from "@/components/home/CommunitiesSection";
import StatsSection from "@/components/home/StatsSection";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log("Index page mounted");
    setIsLoaded(true);
  }, []);

  console.log("Index page rendering, isLoaded:", isLoaded);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-kic-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
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
