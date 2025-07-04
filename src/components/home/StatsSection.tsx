
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Award, Zap, Target, Rocket } from 'lucide-react';

const stats = [
  {
    number: 500,
    suffix: "+",
    label: "Active Members",
    description: "Passionate innovators",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50"
  },
  {
    number: 50,
    suffix: "+",
    label: "Completed Projects",
    description: "Real-world solutions",
    icon: Rocket,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50"
  },
  {
    number: 30,
    suffix: "+",
    label: "Events Per Year",
    description: "Learning opportunities",
    icon: Target,
    color: "from-purple-500 to-indigo-500",
    bgColor: "from-purple-50 to-indigo-50"
  },
  {
    number: 15,
    suffix: "+",
    label: "Industry Partners",
    description: "Collaborative network",
    icon: Award,
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50"
  }
];

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          
          // Animate numbers
          stats.forEach((stat, index) => {
            let start = 0;
            const end = stat.number;
            const duration = 2000;
            const increment = end / (duration / 16);
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                start = end;
                clearInterval(timer);
              }
              setAnimatedNumbers(prev => {
                const newNumbers = [...prev];
                newNumbers[index] = Math.ceil(start);
                return newNumbers;
              });
            }, 16);
          });
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-gradient-to-br from-gray-900 via-kic-green-900 to-emerald-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-kic-green-500/10 to-emerald-500/10" />
        <div className="absolute top-20 left-20 w-40 h-40 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Badge className="mb-6 bg-gradient-to-r from-kic-green-400 to-emerald-400 text-white border-0 px-6 py-2 text-sm font-semibold">
            <TrendingUp className="w-4 h-4 mr-2" />
            Our Growing Impact
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-white via-kic-green-200 to-emerald-200 bg-clip-text text-transparent">
            Driving Innovation Forward
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Building the next generation of tech leaders through community, education, and real-world impact
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className={`group relative overflow-hidden border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms` 
                }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <CardContent className="p-8 text-center relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Number */}
                  <div className="mb-4">
                    <div className={`text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}>
                      {animatedNumbers[index]}{stat.suffix}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-kic-green-200 transition-colors">
                      {stat.label}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                    {stat.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-gray-300 mb-6">
            Ready to be part of our growing community?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-6 py-3 text-sm font-medium hover:bg-white/20 transition-colors cursor-pointer">
              <Zap className="w-4 h-4 mr-2" />
              Join 500+ Innovators
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
