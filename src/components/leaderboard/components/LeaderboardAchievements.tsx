
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Code2, Users } from 'lucide-react';

const LeaderboardAchievements = () => {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:shadow-md transition-all duration-200 transform hover:scale-102">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800">Monthly Champion</h4>
            <p className="text-sm text-gray-600">Most points earned this month</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 transform hover:scale-102">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800">Project Innovator</h4>
            <p className="text-sm text-gray-600">Most creative project submission</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-200 transform hover:scale-102">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800">Community Builder</h4>
            <p className="text-sm text-gray-600">Most active community participant</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardAchievements;
