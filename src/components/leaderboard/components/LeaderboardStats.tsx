
import { Card, CardContent } from '@/components/ui/card';
import { Users, Code2, TrendingUp, Trophy } from 'lucide-react';

const LeaderboardStats = () => {
  const leaderboardStats = [
    {
      title: "Total Members",
      value: "250+",
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200"
    },
    {
      title: "Active Projects",
      value: "45",
      icon: Code2,
      gradient: "from-yellow-500 to-amber-600",
      bgGradient: "from-yellow-50 to-amber-50",
      borderColor: "border-yellow-200"
    },
    {
      title: "Competition Level",
      value: "High",
      icon: TrendingUp,
      gradient: "from-green-600 to-green-700",
      bgGradient: "from-green-50 to-green-100",
      borderColor: "border-green-300"
    },
    {
      title: "Top Achievers",
      value: "15",
      icon: Trophy,
      gradient: "from-yellow-600 to-yellow-700",
      bgGradient: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-300"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {leaderboardStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`bg-gradient-to-br ${stat.bgGradient} ${stat.borderColor} border-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm`}>
            <CardContent className="p-4 text-center">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.gradient} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.title}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default LeaderboardStats;
