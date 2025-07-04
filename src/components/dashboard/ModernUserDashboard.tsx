
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Calendar, 
  FileText, 
  Briefcase, 
  Award, 
  Users, 
  BookOpen, 
  CreditCard,
  TrendingUp,
  Target,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const ModernUserDashboard = () => {
  const { member } = useAuth();

  const quickStats = [
    {
      title: "Events Attended",
      value: "12",
      change: "+3 this month",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "up"
    },
    {
      title: "Blog Posts",
      value: "8",
      change: "+2 this week",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "up"
    },
    {
      title: "Certificates",
      value: "5",
      change: "+1 recent",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trend: "up"
    },
    {
      title: "Communities",
      value: "3",
      change: "Active member",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "stable"
    },
  ];

  const recentActivities = [
    {
      title: "Completed React Workshop",
      time: "2 hours ago",
      type: "workshop",
      points: "+15 points"
    },
    {
      title: "Published blog post: 'AI in Web Development'",
      time: "1 day ago",
      type: "blog",
      points: "+10 points"
    },
    {
      title: "Attended Tech Innovation Meetup",
      time: "3 days ago",
      type: "event",
      points: "+8 points"
    },
    {
      title: "Joined Mobile Development Community",
      time: "1 week ago",
      type: "community",
      points: "+5 points"
    },
  ];

  const upcomingEvents = [
    {
      title: "Hackathon 2024",
      date: "Jan 15, 2024",
      time: "9:00 AM",
      status: "registered"
    },
    {
      title: "AI/ML Workshop",
      date: "Jan 20, 2024", 
      time: "2:00 PM",
      status: "available"
    },
    {
      title: "Industry Networking",
      date: "Jan 25, 2024",
      time: "6:00 PM",
      status: "deadline-soon"
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={item} className="bg-gradient-to-r from-kic-green-500 to-kic-green-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {member?.email?.split('@')[0] || 'Member'}!
            </h1>
            <p className="text-kic-green-100 text-lg">
              Ready to continue your innovation journey today?
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-kic-green-100">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">#15</div>
              <div className="text-sm text-kic-green-100">Leaderboard</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest achievements and participation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <Badge variant="secondary" className="bg-kic-green-100 text-kic-green-700">
                      {activity.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Don't miss these opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge 
                        variant={event.status === 'registered' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {event.status === 'registered' ? 'Registered' : 
                         event.status === 'deadline-soon' ? 'Deadline Soon' : 'Available'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Progress
            </CardTitle>
            <CardDescription>Track your journey and achievements this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Events Goal</span>
                  <span>8/10</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Blog Posts</span>
                  <span>3/5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Learning Hours</span>
                  <span>12/20</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ModernUserDashboard;
