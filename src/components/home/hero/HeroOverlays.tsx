
interface HeroOverlaysProps {
  scrollY: number;
}

export const HeroOverlays = ({ scrollY }: HeroOverlaysProps) => {
  return (
    <>
      {/* Dynamic overlays and patterns */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-10 animate-grid z-0" 
        style={{ transform: `translateY(${scrollY * 0.02}px)` }}
      />
      
      <div className="absolute inset-0 pattern-bg opacity-5 z-0 rotate-180" />
      
      {/* Floating green particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-[#2c7a4d]/10 animate-float-slow" 
             style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
        <div className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-[#2c7a4d]/5 animate-float-medium" 
             style={{ transform: `translateY(${scrollY * -0.05}px)` }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-[#fefefe]/10 animate-float-fast" 
             style={{ transform: `translateY(${scrollY * 0.08}px)` }} />
      </div>
      
      {/* Green accent line */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#2c7a4d]/80 via-[#2c7a4d]/30 to-transparent" />
    </>
  );
};

export default HeroOverlays;
