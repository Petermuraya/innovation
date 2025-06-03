import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Lightbulb, Zap, Orbit, Satellite, Rocket } from "lucide-react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const floatingElements = [
    { icon: Rocket, delay: 0, size: 40, x: 15, y: 20, duration: 25 },
    { icon: Satellite, delay: 2000, size: 32, x: 80, y: 40, duration: 30 },
    { icon: Orbit, delay: 4000, size: 28, x: 70, y: 70, duration: 40 },
  ];

  const gridPattern = {
    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
    backgroundSize: '40px 40px',
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Custom cursor effect */}
      <motion.div
        className="fixed w-6 h-6 rounded-full bg-emerald-400/30 pointer-events-none z-50 mix-blend-exclusion"
        style={{
          x: springX,
          y: springY,
          scale: 1.5,
        }}
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dynamic gradient overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at ${springX.get()}px ${springY.get()}px, rgba(16, 185, 129, 0.4) 0%, transparent 70%)`,
            transition: 'background 0.1s linear'
          }}
        />
        
        {/* Modern grid pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={gridPattern}
        />
        
        {/* Floating geometric shapes with subtle animation */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-emerald-400/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-white/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Floating space-themed icons with smooth paths */}
      <AnimatePresence>
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute text-emerald-400/40"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              x: [`${element.x}%`, `${element.x + 5}%`, `${element.x}%`],
              y: [`${element.y}%`, `${element.y + 5}%`, `${element.y}%`],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay / 1000,
              ease: "linear"
            }}
          >
            <element.icon size={element.size} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main content with staggered animations */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Glowing 404 text */}
              <div className="relative">
                <h1 className="text-8xl md:text-[10rem] font-black text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text mb-6 leading-none tracking-tighter">
                  404
                </h1>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-8xl md:text-[10rem] font-black text-emerald-400/10 blur-xl -z-10">
                  404
                </div>
              </div>

              {/* Error message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Lost in Digital Space
                </h2>
                <p className="text-lg md:text-xl text-gray-300/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                  The page at <span className="text-emerald-300 font-mono">{location.pathname}</span> doesn't exist. 
                  Maybe it's exploring new frontiers or got caught in a black hole.
                </p>
              </motion.div>

              {/* Action buttons with hover effects */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <Button 
                  size="lg" 
                  asChild
                  className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
                >
                  <Link to="/">
                    <span className="relative z-10 flex items-center">
                      <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                      Return Home
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="group relative overflow-hidden border-2 border-emerald-400/30 hover:border-emerald-300 text-emerald-300 hover:text-white px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
                  onClick={() => window.history.back()}
                >
                  <span>
                    <span className="relative z-10 flex items-center">
                      <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      Previous Page
                    </span>
                    <span className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </span>
                </Button>
              </motion.div>

              {/* Interactive suggestion card */}
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              >
                <div className="bg-white/5 backdrop-blur-md border border-emerald-400/20 rounded-2xl p-6 max-w-md mx-auto transform transition-all hover:scale-[1.02] hover:border-emerald-400/40 duration-300">
                  <div className="flex items-start">
                    <div className="bg-emerald-400/10 p-3 rounded-lg mr-4">
                      <Lightbulb className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">While you're here...</h3>
                      <p className="text-gray-300/80 text-sm">
                        Explore our <Link to="/projects" className="text-emerald-300 hover:text-emerald-200 underline">innovation projects</Link> or 
                        join the <Link to="/community" className="text-emerald-300 hover:text-emerald-200 underline">tech community</Link> at Karatina University.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Technical details (shown on hover) */}
              <motion.div
                className="mt-8 opacity-0 hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="bg-black/20 backdrop-blur-sm border border-emerald-400/20 rounded-lg px-4 py-2 inline-block">
                  <code className="text-emerald-300 text-xs font-mono">
                    Route not found: {location.pathname}
                  </code>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle footer */}
      <motion.div 
        className="absolute bottom-6 left-0 right-0 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5 }}
      >
        Karatina University Innovation Club © {new Date().getFullYear()}
      </motion.div>
    </div>
  );
};

export default NotFound;