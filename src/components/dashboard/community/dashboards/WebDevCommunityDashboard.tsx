import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Globe, Code, Database, Palette, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunityGroup } from '../../user/communities/useCommunityData';

interface WebDevCommunityDashboardProps {
  community: CommunityGroup;
}

const WebDevCommunityDashboard = ({ community }: WebDevCommunityDashboardProps) => {
  const navigate = useNavigate();

  const webProjects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with React and Node.js",
      status: "In Progress",
      tech: ["React", "Node.js", "MongoDB", "Stripe"]
    },
    {
      id: 2,
      title: "Portfolio Website Builder",
      description: "Drag-and-drop portfolio builder for students",
      status: "Completed",
      tech: ["Vue.js", "Firebase", "Tailwind CSS"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "React Hooks Deep Dive",
      date: "2024-06-18",
      time: "3:00 PM",
      description: "Advanced React hooks patterns and best practices"
    },
    {
      id: 2,
      title: "Full-Stack Project Showcase",
      date: "2024-06-22",
      time: "1:00 PM",
      description: "Present your web development projects to the community"
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
            <p className="text-kic-gray/70">Web Development Community Dashboard</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Developers</p>
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
                  <p className="text-sm font-medium text-gray-600">Web Projects</p>
                  <p className="text-2xl font-bold text-kic-gray">{webProjects.length}</p>
                </div>
                <Globe className="h-8 w-8 text-kic-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Code Reviews</p>
                  <p className="text-2xl font-bold text-kic-gray">15</p>
                </div>
                <Code className="h-8 w-8 text-kic-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Deployed Sites</p>
                  <p className="text-2xl font-bold text-kic-gray">12</p>
                </div>
                <Database className="h-8 w-8 text-kic-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Web Projects</TabsTrigger>
            <TabsTrigger value="events">Coding Sessions</TabsTrigger>
            <TabsTrigger value="resources">Dev Resources</TabsTrigger>
            <TabsTrigger value="showcase">Project Showcase</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Active Web Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-kic-gray">{project.title}</h4>
                        <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
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
                        <Button size="sm">Live Demo</Button>
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
                  Upcoming Coding Sessions
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
                        <Button size="sm">Join Session</Button>
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
                <CardTitle>Developer Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Frontend Frameworks</h4>
                    <p className="text-sm text-gray-600">React, Vue.js, Angular tutorials and best practices</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Backend Development</h4>
                    <p className="text-sm text-gray-600">Node.js, Express, database integration guides</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">CSS & Design</h4>
                    <p className="text-sm text-gray-600">Modern CSS, Tailwind, responsive design patterns</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Deployment & DevOps</h4>
                    <p className="text-sm text-gray-600">Hosting, CI/CD, monitoring, and scaling web apps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="showcase">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Featured Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <img 
                      src="/placeholder.svg" 
                      alt="Project Screenshot" 
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h4 className="font-medium mb-2">KIC Student Portal</h4>
                    <p className="text-sm text-gray-600 mb-2">Student management system built with React</p>
                    <Badge variant="outline">Live</Badge>
                  </div>
                  <div className="border rounded-lg p-4">
                    <img 
                      src="/placeholder.svg" 
                      alt="Project Screenshot" 
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                    <h4 className="font-medium mb-2">Event Management App</h4>
                    <p className="text-sm text-gray-600 mb-2">Full-stack event booking platform</p>
                    <Badge variant="outline">Live</Badge>
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

export default WebDevCommunityDashboard;
