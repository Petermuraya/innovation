
import { useState, useEffect } from "react";

interface HeroBackgroundProps {
  scrollY: number;
}

export default function HeroBackground({ scrollY }: HeroBackgroundProps) {
  return (
    <>
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
        
        {/* Floating shapes */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
        </div>
      </div>
    </>
  );
}
