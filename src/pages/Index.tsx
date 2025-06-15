
import React, { useEffect, useRef } from 'react';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import CommunitiesSection from '@/components/home/CommunitiesSection';
import ElectionBanner from '@/components/home/ElectionBanner';
import { MetaHead } from '@/components/seo/MetaHead';
import { StructuredData } from '@/components/seo/StructuredData';

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
      <MetaHead 
        title="Home"
        description="Welcome to Kabarak University Innovation Club - Where creativity meets technology. Join our community of innovators, developers, and tech enthusiasts."
        keywords="innovation, technology, university club, programming, development, students"
      />
      <StructuredData />
      
      <div className="min-h-screen">
        <HeroSection scrollToNextSection={scrollToNextSection} />
        
        {/* Election Banner - Only shows during active elections */}
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
