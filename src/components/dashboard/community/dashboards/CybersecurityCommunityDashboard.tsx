
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  Calendar, 
  Users, 
  BookOpen, 
  AlertTriangle,
  Key,
  Bug,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import CommunityDashboardTabs from '../CommunityDashboardTabs';
import type { CommunityGroup } from '../../user/communities/useCommunityData';

interface CybersecurityCommunityDashboardProps {
  community: CommunityGroup;
}

const CybersecurityCommunityDashboard = ({ community }: CybersecurityCommunityDashboardProps) => {
  const cyberFeatures = [
    {
      title: "Ethical Hacking",
      description: "Penetration testing & vulnerability assessment",
      icon: Bug,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Network Security",
      description: "Firewall configuration & network monitoring",
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Cryptography",
      description: "Encryption, decryption & secure communications",
      icon: Key,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Incident Response",
      description: "Security breach analysis & response",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  const securityTools = [
    "Kali Linux", "Wireshark", "Metasploit", "Nessus", 
    "Burp Suite", "OWASP ZAP", "Nmap", "John the Ripper"
  ];

  const upcomingChallenges = [
    "Web Application Security CTF",
    "Network Penetration Testing Lab", 
    "Malware Analysis Workshop",
    "Social Engineering Awareness"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4 sm:p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Shield className="h-8 w-8" />
                {community.name}
              </h1>
              <p className="text-red-100 text-lg">
                Defending digital assets and building secure systems
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
              <Lock className="h-16 w-16 text-red-200" />
              <Eye className="h-16 w-16 text-orange-300" />
              <Zap className="h-16 w-16 text-red-200" />
            </div>
          </div>
        </motion.div>

        {/* Cybersecurity Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cyberFeatures.map((feature, index) => {
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

        {/* Security Tools and Challenges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Tools & Frameworks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{community.description}</p>
                <div className="flex flex-wrap gap-2">
                  {securityTools.map((tool, index) => (
                    <Badge key={index} variant="secondary" className="bg-red-100 text-red-700">
                      {tool}
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
                  Upcoming Challenges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingChallenges.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{challenge}</span>
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

export default CybersecurityCommunityDashboard;
