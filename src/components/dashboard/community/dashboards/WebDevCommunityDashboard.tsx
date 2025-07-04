
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Globe, 
  Layout, 
  Calendar, 
  Users, 
  BookOpen, 
  Smartphone,
  Database,
  Palette,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import CommunityDashboardTabs from '../CommunityDashboardTabs';
import type { CommunityGroup } from '../../user/communities/useCommunityData';

interface WebDevCommunityDashboardProps {
  community: CommunityGroup;
}

const WebDevCommunityDashboard = ({ community }: WebDevCommunityDashboardProps) => {
  const webDevFeatures = [
    {
      title: "Frontend Development",
      description: "React, Vue, Angular & modern UI",
      icon: Layout,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Backend Development",
      description: "Node.js, Python, APIs & databases",
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Full Stack Projects",
      description: "End-to-end web applications",
      icon: Globe,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "UI/UX Design",
      description: "Design systems & user experience",
      icon: Palette,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const techStack = [
    "React", "Next.js", "TypeScript", "Node.js", 
    "Express", "MongoDB", "PostgreSQL", "Tailwind CSS"
  ];

  const upcomingWorkshops = [
    "Advanced React Patterns",
    "GraphQL API Development", 
    "Microservices Architecture",
    "Modern CSS Techniques"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Code className="h-8 w-8" />
                {community.name}
              </h1>
              <p className="text-green-100 text-lg">
                Building the web of tomorrow with modern technologies
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
              <Globe className="h-16 w-16 text-green-200" />
              <Smartphone className="h-16 w-16 text-blue-300" />
              <Zap className="h-16 w-16 text-green-200" />
            </div>
          </div>
        </motion.div>

        {/* Web Dev Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {webDevFeatures.map((feature, index) => {
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

        {/* Tech Stack and Workshops */}
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
                  Our Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{community.description}</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                      {tech}
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
                  <BookOpen className="h-5 w-5" />
                  Upcoming Workshops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingWorkshops.map((workshop, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{workshop}</span>
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

export default WebDevCommunityDashboard;
