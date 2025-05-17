
import { useState, useEffect } from 'react';
import { MoveIn } from "@/components/ui/animations";

// Enhanced CSS-based animated cube component with better styling and hover effects
const CubeMesh = () => {
  const [hovered, setHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  // Dynamic rotation based on mouse position
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setRotation({
      x: (y - centerY) / 10,
      y: (x - centerX) / 10
    });
  };

  return (
    <div
      className={`relative transform-gpu transition-all duration-300 ease-in-out ${
        hovered ? 'scale-110' : 'scale-100'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setRotation({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
    >
      <div 
        className="w-32 h-32 md:w-40 md:h-40 rotate-cube bg-gradient-to-br from-innovation-600 to-innovation-800 rounded-lg shadow-xl border border-white/10"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.2s ease-out' 
        }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg" />
        
        {/* Faces of the cube with hover highlight */}
        <div className={`absolute inset-0 border-2 ${hovered ? 'border-innovation-400' : 'border-white/10'} rounded-lg transition-colors`}></div>
        
        {/* Glow effect on hover */}
        <div className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`} style={{ boxShadow: '0 0 15px 5px rgba(98, 113, 236, 0.3)' }}></div>
      </div>
    </div>
  );
};

// Enhanced CSS-based animated sphere component with better styling and interactive effects
const InnovationSphere = () => {
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Interactive movement following cursor
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / 20; 
    const y = (e.clientY - rect.top) / 20;
    
    setPosition({ x, y });
  };

  // Reset position when not hovering
  useEffect(() => {
    if (!hovered) {
      const timer = setTimeout(() => {
        setPosition({ x: 0, y: 0 });
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [hovered]);

  return (
    <div
      className={`relative transform-gpu transition-all duration-300 ease-in-out ${
        hovered ? 'scale-110' : 'scale-100'
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
      }}
    >
      <div className="w-28 h-28 md:w-36 md:h-36 rounded-full rotate-sphere bg-gradient-to-br from-blue-400/90 to-innovation-500/80 shadow-lg opacity-90 border border-white/10 overflow-hidden">
        {/* Inner sphere details */}
        <div className={`absolute inset-0 border-2 border-dashed ${
          hovered ? 'border-white/40' : 'border-white/20'
        } rounded-full transition-colors`}></div>
        
        {/* Light reflection effect */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-white/20 rounded-full transform -translate-y-1/2"></div>
        
        {/* Ripple effect on hover */}
        {hovered && (
          <>
            <div className="absolute inset-0 bg-white/5 rounded-full animate-ping"></div>
            <div className="absolute inset-2 bg-white/10 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-4 bg-white/15 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default function InnovationCube() {
  // Dynamic particles with mouse interaction
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="h-full w-full min-h-[300px] flex items-center justify-center relative overflow-hidden">
      {/* Enhanced animated background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80 z-0" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid z-0" />
      
      {/* Container for the shapes */}
      <div className="relative z-10 flex flex-row items-center justify-around w-full px-8">
        <CubeMesh />
        <InnovationSphere />
      </div>
      
      {/* Enhanced floating particles with better animation and mouse interaction */}
      <div 
        className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-innovation-500/50 animate-float-slow" 
        style={{ 
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          transition: 'transform 0.5s ease-out'
        }}
      />
      <div 
        className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-secondary/50 animate-float-medium"
        style={{ 
          transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
          transition: 'transform 0.8s ease-out'
        }}
      />
      <div 
        className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-innovation-300/30 animate-float-fast"
        style={{ 
          transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 25}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
      <div 
        className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-innovation-400/40 animate-float-slow"
        style={{ 
          transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
          transition: 'transform 0.6s ease-out'
        }}
      />
      <div 
        className="absolute top-1/3 right-1/2 w-2 h-2 rounded-full bg-innovation-200/50 animate-float-medium"
        style={{ 
          transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px)`,
          transition: 'transform 0.7s ease-out'
        }}
      />
    </div>
  );
}
