
import { useState, useEffect } from "react";

interface HeroBackgroundProps {
  scrollY: number;
}

export default function HeroBackground({ scrollY }: HeroBackgroundProps) {
  return (
    <>
      {/* Enhanced Background Elements with Brand Colors */}
      <div className="absolute inset-0">
        {/* Animated grid pattern with brand colors */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.4) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`
          }}
        />
        
        {/* Enhanced floating shapes with brand colors */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/6 left-1/6 w-96 h-96 bg-gradient-to-r from-green-400/20 to-yellow-400/15 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.1}deg)` }}
          />
          <div 
            className="absolute bottom-1/6 right-1/4 w-80 h-80 bg-gradient-to-l from-yellow-400/20 to-green-400/15 rounded-full blur-3xl animate-pulse delay-1000"
            style={{ transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.1}deg)` }}
          />
          <div 
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-tr from-green-500/10 to-yellow-500/10 rounded-full blur-2xl animate-pulse delay-500"
            style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.05}px)` }}
          />
        </div>

        {/* Brand-colored particle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-pulse ${
                i % 3 === 0 ? 'bg-green-400/30' : i % 3 === 1 ? 'bg-yellow-400/30' : 'bg-emerald-300/30'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                transform: `translateY(${scrollY * (0.01 + Math.random() * 0.02)}px)`
              }}
            />
          ))}
        </div>

        {/* Enhanced geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-green-400 rotate-45 animate-spin-slow"
            style={{ transform: `rotate(45deg) translateY(${scrollY * 0.05}px)`, animationDuration: '20s' }}
          />
          <div 
            className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-yellow-400 rotate-12 animate-bounce"
            style={{ transform: `rotate(12deg) translateY(${scrollY * -0.03}px)` }}
          />
        </div>
      </div>
    </>
  );
}
