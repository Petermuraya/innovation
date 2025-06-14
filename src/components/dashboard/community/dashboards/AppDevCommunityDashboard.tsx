
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Smartphone, Tablet, Monitor, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunityGroup } from '../user/communities/useCommunityData';

interface AppDevCommunityDashboardProps {
  community: CommunityGroup;
}

const AppDevCommunityDashboard = ({ community }: AppDevCommunityDashboardProps) => {
  const navigate = useNavigate();

  const appProjects = [
    {
      id: 1,
      title: "KIC Mobile App",
      description: "Official mobile app for Karatina Innovation Club",
      status: "In Progress",
      platform: "Cross-Platform",
      tech: ["React Native", "Firebase", "Redux"]
    },
    {
      id: 2,
      title: "Study Buddy",
      description: "Collaborative learning app for students",
      status: "Beta Testing",
      platform: "Android",
      tech: ["Flutter", "Dart", "SQLite"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Flutter Workshop",
      date: "2024-06-19",
      time: "2:30 PM",
      description: "Building your first Flutter app from scratch"
    },
    {
      id: 2,
      title: "App Store Optimization",
      date: "2024-06-24",
      time: "3:30 PM",
      description: "Tips for getting your app discovered on app stores"
    }
  ];

  return (
    <div className="min-h-screen bg-kic-lightGray">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-kic-gray">{community.name}</h1>
            <p className="text-kic-gray/70">Mobile & Desktop App Development</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">App Developers</p>
                  <p className="text-2xl font-bold text-kic-gray">{community.member_count}</p>
                </div>
                <Users className="h-8 w-8 text-kic-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mobile Apps</p>
                  <p className="text-2xl font-bold text-kic-gray">6</p>
                </div>
                <Smartphone className="h-8 w-8 text-kic-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Desktop Apps</p>
                  <p className="text-2xl font-bold text-kic-gray">3</p>
                </div>
                <Monitor className="h-8 w-8 text-kic-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-kic-gray">1.2k</p>
                </div>
                <Download className="h-8 w-8 text-kic-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">App Projects</TabsTrigger>
            <TabsTrigger value="events">Workshops</TabsTrigger>
            <TabsTrigger value="resources">Dev Tools</TabsTrigger>
            <TabsTrigger value="testing">Beta Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tablet className="w-5 h-5" />
                  Active App Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-kic-gray">{project.title}</h4>
                          <Badge variant="outline" className="mt-1">{project.platform}</Badge>
                        </div>
                        <Badge variant={project.status === 'Beta Testing' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View Code</Button>
                        <Button size="sm">Install APK</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  App Development Workshops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-kic-gray">{event.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{event.date}</span>
                            <span>{event.time}</span>
                          </div>
                        </div>
                        <Button size="sm">Register</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Development Tools & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Flutter Development</h4>
                    <p className="text-sm text-gray-600">Cross-platform mobile app development with Dart</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">React Native</h4>
                    <p className="text-sm text-gray-600">JavaScript-based mobile app development framework</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Android Native</h4>
                    <p className="text-sm text-gray-600">Kotlin/Java development for Android platforms</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Electron Desktop Apps</h4>
                    <p className="text-sm text-gray-600">Web technologies for desktop application development</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Beta Testing Program
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Study Buddy v2.1</h4>
                        <p className="text-sm text-gray-600">New collaboration features</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="default">Testing</Badge>
                        <Button size="sm">Join Beta</Button>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Campus Navigator</h4>
                        <p className="text-sm text-gray-600">Interactive campus map application</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Coming Soon</Badge>
                        <Button size="sm" variant="outline">Notify Me</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppDevCommunityDashboard;
