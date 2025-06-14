
import { Users, Code, Lightbulb } from "lucide-react";

interface HeroFeaturesProps {
  isVisible: boolean;
}

export default function HeroFeatures({ isVisible }: HeroFeaturesProps) {
  const features = [
    { icon: Users, title: "Tech Community", description: "Connect with innovators" },
    { icon: Code, title: "Code & Create", description: "Build amazing projects" },
    { icon: Lightbulb, title: "Innovation Hub", description: "Turn ideas into reality" }
  ];

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 transition-all duration-700 delay-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {features.map((feature, index) => (
        <div 
          key={index}
          className="group p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-emerald-400/20 hover:bg-white/10 hover:border-emerald-300/40 transition-all duration-300"
        >
          <feature.icon className="w-6 h-6 text-emerald-300 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
          <p className="text-sm text-emerald-100/70">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
