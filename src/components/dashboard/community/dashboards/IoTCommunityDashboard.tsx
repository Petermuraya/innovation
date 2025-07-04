
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Wifi, 
  Activity, 
  Calendar, 
  Users, 
  BookOpen, 
  Zap,
  Thermometer,
  Shield,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import CommunityDashboardTabs from '../CommunityDashboardTabs';
import type { CommunityGroup } from '../../user/communities/useCommunityData';

interface IoTCommunityDashboardProps {
  community: CommunityGroup;
}

const IoTCommunityDashboard = ({ community }: IoTCommunityDashboardProps) => {
  const iotFeatures = [
    {
      title: "Sensor Networks",
      description: "Build and manage sensor networks",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Connected Devices",
      description: "Develop IoT device connectivity",
      icon: Wifi,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Edge Computing",
      description: "Process data at the edge",
      icon: Cpu,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Smart Home",
      description: "Home automation projects",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const upcomingProjects = [
    "Smart Agriculture Monitoring System",
    "Industrial IoT Dashboard",
    "Environmental Sensor Network",
    "Smart City Traffic Management"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Cpu className="h-8 w-8" />
                {community.name}
              </h1>
              <p className="text-blue-100 text-lg">
                Building the connected future with IoT solutions
              </p>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Users className="h-4 w-4 mr-1" />
                  {community.member_count} Members
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Calendar className="h-4 w-4 mr-1" />
                  {community.meeting_schedule}
                </Badge>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Thermometer className="h-16 w-16 text-blue-200" />
              <Shield className="h-16 w-16 text-blue-300" />
              <Zap className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </motion.div>

        {/* IoT Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {iotFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`p-3 rounded-full ${feature.bgColor} w-fit mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Quick Stats and Upcoming Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Community Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{community.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">Hardware Kits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingProjects.map((project, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{project}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Community Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <CommunityDashboardTabs communityId={community.id} />
        </motion.div>
      </div>
    </div>
  );
};

export default IoTCommunityDashboard;
