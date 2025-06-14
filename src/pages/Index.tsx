
import { useState, useEffect } from "react";

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

const HomePage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const initializePage = () => {
      console.log("Home page mounted");
      setIsMounted(true);
    };

    const handleScroll = () => setScrollY(window.scrollY);

    initializePage();
    window.addEventListener("scroll", handleScroll);

    return () => {
      console.log("Home page unmounted");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-kic-green-500 mx-auto"></div>
          <p className="mt-4 text-kic-gray">Loading...</p>
        </div>
      </div>
    );
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
        
        <section 
          id="stats-section" 
          aria-label="Statistics"
          className="transform transition-all duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        >
          <StatsSection />
        </section>
        
        <section 
          className="transform transition-all duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * 0.01}px)` }}
        >
          <FeaturedProjects />
        </section>
        
        <section 
          className="transform transition-all duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * 0.005}px)` }}
        >
          <UpcomingEvents />
        </section>
        
        <section 
          className="transform transition-all duration-300 ease-out"
          style={{ transform: `translateY(${scrollY * 0.002}px)` }}
        >
          <CommunitiesSection />
        </section>
      </main>
    </>
  );
};

export default HomePage;
