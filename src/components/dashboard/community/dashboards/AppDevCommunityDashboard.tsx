
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Calendar, 
  Users, 
  BookOpen, 
  Download,
  Code,
  Zap,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import CommunityDashboardTabs from '../CommunityDashboardTabs';
import type { CommunityGroup } from '../../user/communities/useCommunityData';

interface AppDevCommunityDashboardProps {
  community: CommunityGroup;
}

const AppDevCommunityDashboard = ({ community }: AppDevCommunityDashboardProps) => {
  const appDevFeatures = [
    {
      title: "iOS Development",
      description: "Swift, SwiftUI, and native iOS apps",
      icon: Smartphone,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Android Development",
      description: "Kotlin, Java, and native Android",
      icon: Tablet,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Cross-Platform",
      description: "React Native, Flutter, Xamarin",
      icon: Monitor,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "App Store Optimization",
      description: "Publishing and marketing apps",
      icon: Download,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const platforms = [
    "React Native", "Flutter", "Swift", "Kotlin", 
    "Xamarin", "Ionic", "Cordova", "Progressive Web Apps"
  ];

  const currentProjects = [
    "E-commerce Mobile App",
    "Fitness Tracking Application", 
    "Social Media Platform",
    "Educational Learning App"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4 sm:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Smartphone className="h-8 w-8" />
                {community.name}
              </h1>
              <p className="text-purple-100 text-lg">
                Creating mobile experiences that users love
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
              <Smartphone className="h-16 w-16 text-purple-200" />
              <Tablet className="h-16 w-16 text-pink-300" />
              <Globe className="h-16 w-16 text-purple-200" />
            </div>
          </div>
        </motion.div>

        {/* App Dev Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {appDevFeatures.map((feature, index) => {
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

        {/* Platforms and Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Development Platforms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{community.description}</p>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {platform}
                    </Badge>
                  ))}
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
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Current Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentProjects.map((project, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
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

export default AppDevCommunityDashboard;
