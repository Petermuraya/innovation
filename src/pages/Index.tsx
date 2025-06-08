import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Components
import HeroSection from "@/components/home/HeroSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import CommunitiesSection from "@/components/home/CommunitiesSection";
import StatsSection from "@/components/home/StatsSection";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";

// Constants
const SEO_CONFIG = {
  title: "Home",
  description: "Karatina University Innovation Club - Building technology leaders of tomorrow through innovation, collaboration, and cutting-edge projects. Join our community of tech enthusiasts.",
  canonical: "/",
  keywords: [
    "Karatina University", 
    "innovation club", 
    "technology", 
    "programming", 
    "web development", 
    "AI", 
    "hackathons", 
    "tech community"
  ],
};

// Dynamic imports for better performance (optional)
const LoadingSpinner = dynamic(() => import("@/components/common/LoadingSpinner"));

const HomePage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const initializePage = () => {
      console.log("Home page mounted");
      setIsMounted(true);
    };

    initializePage();

    return () => {
      console.log("Home page unmounted");
    };
  }, []);

  if (!isMounted) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* SEO Metadata */}
      <SEOHead {...SEO_CONFIG} />
      <StructuredData type="organization" />
      <StructuredData type="webpage" />

      {/* Page Content */}
      <main className="flex flex-col w-full bg-kic-lightGray">
        <HeroSection />
        
        <section id="stats-section" aria-label="Statistics">
          <StatsSection />
        </section>
        
        <FeaturedProjects />
        <UpcomingEvents />
        <CommunitiesSection />
      </main>
    </>
  );
};

export default HomePage;
