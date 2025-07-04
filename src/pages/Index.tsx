
import React from 'react';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';

const Index = () => {
  console.log("Index page rendering");
  
  return (
    <Layout>
      <div className="min-h-screen">
        <HeroSection />
      </div>
    </Layout>
  );
};

export default Index;
