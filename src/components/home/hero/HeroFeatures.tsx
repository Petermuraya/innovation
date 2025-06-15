
import { Users, Code, Lightbulb, Trophy, Zap, Target } from "lucide-react";

interface HeroFeaturesProps {
  isVisible: boolean;
}

export default function HeroFeatures({ isVisible }: HeroFeaturesProps) {
  const features = [
    { 
      icon: Users, 
      title: "Tech Community", 
      description: "Connect with like-minded innovators",
      color: "from-green-400 to-green-500"
    },
    { 
      icon: Code, 
      title: "Code & Create", 
      description: "Build amazing projects together",
      color: "from-yellow-400 to-yellow-500"
    },
    { 
      icon: Lightbulb, 
      title: "Innovation Hub", 
      description: "Transform ideas into reality",
      color: "from-green-400 to-yellow-400"
    },
    { 
      icon: Trophy, 
      title: "Compete & Win", 
      description: "Showcase your skills and achievements",
      color: "from-yellow-500 to-green-500"
    },
    { 
      icon: Zap, 
      title: "Fast Track", 
      description: "Accelerate your tech career",
      color: "from-green-500 to-emerald-500"
    },
    { 
      icon: Target, 
      title: "Goal Oriented", 
      description: "Achieve your technology dreams",
      color: "from-yellow-400 to-amber-500"
    }
  ];

  return (
    <div 
      className={`grid grid-cols-2 md:grid-cols-3 gap-4 pt-12 transition-all duration-700 delay-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {features.map((feature, index) => (
        <div 
          key={index}
          className="group relative p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-green-400/20 hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-400/20"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
            <feature.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-bold text-white mb-2 text-lg">{feature.title}</h3>
          <p className="text-sm text-green-100/80 leading-relaxed">{feature.description}</p>
          
          {/* Hover effect overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
