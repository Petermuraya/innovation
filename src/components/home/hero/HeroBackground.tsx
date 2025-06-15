
interface HeroBackgroundProps {
  scrollY: number;
}

export default function HeroBackground({ scrollY }: HeroBackgroundProps) {
  return (
    <>
      {/* Animated background elements */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-300/20 rounded-full animate-ping" />
        <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-yellow-300/20 rounded-full animate-pulse" />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/50 to-green-900/80" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-300/40 rounded-full animate-pulse"
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
