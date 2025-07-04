
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BarChart3, 
  Database, 
  Calendar, 
  Users, 
  BookOpen, 
  Cpu,
  TrendingUp,
  Zap,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import CommunityDashboardTabs from '../CommunityDashboardTabs';
import type { CommunityGroup } from '../../user/communities/useCommunityData';

interface DataScienceCommunityDashboardProps {
  community: CommunityGroup;
}

const DataScienceCommunityDashboard = ({ community }: DataScienceCommunityDashboardProps) => {
  const dataScienceFeatures = [
    {
      title: "Machine Learning",
      description: "Supervised & unsupervised learning algorithms",
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Data Analysis",
      description: "Statistical analysis & data visualization",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Deep Learning",
      description: "Neural networks & AI model development",
      icon: Cpu,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Big Data",
      description: "Large-scale data processing & analytics",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const techStack = [
    "Python", "R", "TensorFlow", "PyTorch", 
    "Pandas", "NumPy", "Scikit-learn", "Jupyter"
  ];

  const ongoingProjects = [
    "Predictive Analytics Dashboard",
    "Natural Language Processing Tool", 
    "Computer Vision Application",
    "Recommendation System Engine"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Brain className="h-8 w-8" />
                {community.name}
              </h1>
              <p className="text-indigo-100 text-lg">
                Turning data into insights with AI and machine learning
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
              <TrendingUp className="h-16 w-16 text-indigo-200" />
              <Eye className="h-16 w-16 text-purple-300" />
              <Zap className="h-16 w-16 text-indigo-200" />
            </div>
          </div>
        </motion.div>

        {/* Data Science Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {dataScienceFeatures.map((feature, index) => {
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

        {/* Tech Stack and Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Science Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{community.description}</p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-700">
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
                  Ongoing Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ongoingProjects.map((project, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
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

export default DataScienceCommunityDashboard;
