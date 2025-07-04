
import React, { useEffect, useRef } from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import CommunitiesSection from '@/components/home/CommunitiesSection';
import ElectionBanner from '@/components/home/ElectionBanner';
import SEOHead from '@/components/seo/SEOHead';
import StructuredData from '@/components/seo/StructuredData';

const Index = () => {
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const scrollToNextSection = () => {
    nextSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <>
      <SEOHead 
        title="Home - Building Innovation Leaders"
        description="Welcome to Karatina University Innovation Club - Where creativity meets technology. Join our community of innovators, developers, and tech enthusiasts building the future."
        keywords={["innovation", "technology", "university club", "programming", "development", "students", "karatina", "kenya"]}
        canonical="/"
        type="website"
      />
      <StructuredData type="organization" />
      
      <div className="min-h-screen">
        <HeroSection />
        <ElectionBanner />
        <div ref={nextSectionRef}>
          <StatsSection />
        </div>
        <FeaturedProjects />
        <UpcomingEvents />
        <CommunitiesSection />
      </div>
    </>
  );
};

export default Index;
