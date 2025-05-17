
import { Users, Code, Lightbulb } from "lucide-react";

interface FeatureHighlightsProps {
  isVisible: boolean;
}

export const FeatureHighlights = ({ isVisible }: FeatureHighlightsProps) => {
  const features = [
    {
      icon: <Users size={18} className="text-[#b28d49]" />,
      title: "Tech Community"
    },
    {
      icon: <Code size={18} className="text-[#b28d49]" />,
      title: "Code & Create"
    },
    {
      icon: <Lightbulb size={18} className="text-[#b28d49]" />,
      title: "Ideation Hub"
    }
  ];

  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-3 gap-3 mt-10 transition-all duration-700 delay-400 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-[#b28d49]/20 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#b28d49]/40"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#b28d49]/20 p-2 rounded-full">
              {feature.icon}
            </div>
            <p className="font-medium text-sm text-left text-[#fefefe]">{feature.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureHighlights;
