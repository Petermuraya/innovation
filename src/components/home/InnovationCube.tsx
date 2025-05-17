
import { useState } from 'react';

// CSS-based animated cube component
const CubeMesh = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative transform-gpu transition-all duration-300 ease-in-out ${
        hovered ? 'scale-110' : 'scale-100'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-32 h-32 md:w-40 md:h-40 rotate-cube bg-gradient-to-br from-primary/70 to-purple-500/80 rounded-lg shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg" />
      </div>
    </div>
  );
};

// CSS-based animated sphere component
const InnovationSphere = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative transform-gpu transition-all duration-300 ease-in-out ${
        hovered ? 'scale-110' : 'scale-100'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full rotate-sphere bg-gradient-to-br from-blue-400/90 to-purple-500/80 shadow-lg opacity-90">
        <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full" />
      </div>
    </div>
  );
};

export default function InnovationCube() {
  return (
    <div className="h-full w-full min-h-[300px] flex items-center justify-center relative overflow-hidden">
      {/* Add animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80 z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid z-0" />
      
      {/* Container for the shapes */}
      <div className="relative z-10 flex flex-row items-center justify-around w-full px-8">
        <CubeMesh />
        <InnovationSphere />
      </div>
      
      {/* Add some floating particles */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary/50 animate-float-slow" />
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-secondary/50 animate-float-medium" />
      <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-primary/30 animate-float-fast" />
    </div>
  );
}
