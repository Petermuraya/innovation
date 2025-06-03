
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Lightbulb, Zap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingElements = [
    { icon: Lightbulb, delay: 0, size: 32 },
    { icon: Zap, delay: 1000, size: 28 },
    { icon: Search, delay: 2000, size: 24 },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Dynamic gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(52, 211, 153, 0.3) 0%, transparent 50%)`
          }}
        />
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-300/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Floating icons */}
      {floatingElements.map((element, index) => (
        <div
          key={index}
          className={`absolute animate-bounce`}
          style={{
            top: `${20 + index * 15}%`,
            right: `${10 + index * 20}%`,
            animationDelay: `${element.delay}ms`,
            animationDuration: '3s'
          }}
        >
          <element.icon 
            size={element.size} 
            className="text-emerald-300/50" 
          />
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* 404 Number with glowing effect */}
        <div 
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text mb-6 leading-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl md:text-[12rem] font-black text-emerald-400/20 blur-sm -z-10">
            404
          </div>
        </div>

        {/* Error message */}
        <div 
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Oops! Lost in Space
          </h2>
          <p className="text-xl md:text-2xl text-emerald-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have drifted into the digital void. 
            Let's get you back to familiar territory!
          </p>
        </div>

        {/* Action buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button 
            size="lg" 
            asChild
            className="group bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
          >
            <Link to="/">
              <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </Link>
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            asChild
            className="group border-2 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-300 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <span>
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </span>
          </Button>
        </div>

        {/* Fun fact or tip */}
        <div 
          className={`mt-12 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-emerald-400/20 rounded-2xl p-6 max-w-md mx-auto">
            <Lightbulb className="w-8 h-8 text-emerald-300 mx-auto mb-3" />
            <p className="text-emerald-100/70 text-sm">
              <strong className="text-emerald-300">Pro Tip:</strong> While you're here, why not explore our 
              <Link to="/projects" className="text-emerald-300 hover:text-emerald-200 underline mx-1">
                latest projects
              </Link>
              or join our 
              <Link to="/community" className="text-emerald-300 hover:text-emerald-200 underline mx-1">
                innovation community
              </Link>
              ?
            </p>
          </div>
        </div>

        {/* Animated route path display */}
        <div 
          className={`mt-8 transition-all duration-1000 delay-900 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-black/20 backdrop-blur-sm border border-emerald-400/20 rounded-lg px-4 py-2 inline-block">
            <code className="text-emerald-300 text-sm">
              {location.pathname}
            </code>
          </div>
        </div>
      </div>

      {/* CSS for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
