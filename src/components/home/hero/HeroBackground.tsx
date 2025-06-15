
interface HeroBackgroundProps {
  scrollY: number;
}

export default function HeroBackground({ scrollY }: HeroBackgroundProps) {
  return (
    <>
      {/* Animated background elements - responsive */}
      <div 
        className="absolute inset-0 opacity-20 sm:opacity-30"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-400/20 rounded-full animate-pulse" />
        <div className="absolute top-16 sm:top-32 right-10 sm:right-20 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-yellow-400/20 rounded-full animate-bounce" />
        <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-300/20 rounded-full animate-ping" />
        <div className="absolute top-1/2 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-300/20 rounded-full animate-pulse" />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/50 to-green-900/80" />
      
      {/* Animated particles - responsive count */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(window.innerWidth < 768 ? 10 : 20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-green-300/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </>
  );
}
