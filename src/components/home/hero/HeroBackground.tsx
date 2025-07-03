interface HeroBackgroundProps {
  scrollY: number;
}

export default function HeroBackground({ scrollY }: HeroBackgroundProps) {
  // Memoize particle count based on screen size
  const particleCount = typeof window !== 'undefined' ? 
    (window.innerWidth < 768 ? 12 : 30) : 
    30;

  return (
    <>
      {/* Animated background elements with parallax effect */}
      <div 
        className="absolute inset-0 opacity-20 sm:opacity-30 pointer-events-none"
        style={{ 
          transform: `translateY(${scrollY * 0.5}px)`,
          willChange: 'transform' // Performance optimization
        }}
      >
        {/* Floating orbs with varying sizes and animations */}
        <motion.div
          className="absolute top-5 sm:top-10 left-5 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-400/20 rounded-full"
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [0.95, 1.05, 0.95],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-16 sm:top-32 right-10 sm:right-20 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-yellow-400/20 rounded-full"
          animate={{
            y: ["0%", "10%", "0%"],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-10 sm:bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-300/20 rounded-full"
          animate={{
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-300/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Gradient overlay with subtle animation */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/50 to-green-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Optimized particles with Framer Motion for smoother animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(particleCount)].map((_, i) => {
          const size = 0.5 + Math.random() * 1.5;
          const duration = 3 + Math.random() * 4;
          
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute bg-green-300/40 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [`${Math.random() * 20}px`, `${Math.random() * 20 - 40}px`],
                x: [`${Math.random() * 10}px`, `${Math.random() * 20 - 10}px`],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          );
        })}
      </div>

      {/* Subtle grid pattern for depth */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </>
  );
}