import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Zap, Wifi, Cpu, Radio, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunityGroup } from '../../user/communities/useCommunityData';

interface IoTCommunityDashboardProps {
  community: CommunityGroup;
}

const IoTCommunityDashboard = ({ community }: IoTCommunityDashboardProps) => {
  const navigate = useNavigate();

  const iotProjects = [
    {
      id: 1,
      title: "Smart Home Automation",
      description: "Arduino-based home automation system with sensor integration",
      status: "In Progress",
      tech: ["Arduino", "ESP32", "MQTT", "Home Assistant"]
    },
    {
      id: 2,
      title: "Environmental Monitoring Station",
      description: "IoT sensors for air quality, temperature, and humidity monitoring",
      status: "Completed",
      tech: ["Raspberry Pi", "Python", "InfluxDB", "Grafana"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Arduino Workshop",
      date: "2024-06-20",
      time: "2:00 PM",
      description: "Hands-on Arduino programming session"
    },
    {
      id: 2,
      title: "IoT Security Best Practices",
      date: "2024-06-25",
      time: "4:00 PM",
      description: "Learn about securing IoT devices and networks"
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
            <p className="text-kic-gray/70">Internet of Things Community Dashboard</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
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
                  <p className="text-sm font-medium text-gray-600">IoT Projects</p>
                  <p className="text-2xl font-bold text-kic-gray">{iotProjects.length}</p>
                </div>
                <Cpu className="h-8 w-8 text-kic-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Devices</p>
                  <p className="text-2xl font-bold text-kic-gray">24</p>
                </div>
                <Wifi className="h-8 w-8 text-kic-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Workshops</p>
                  <p className="text-2xl font-bold text-kic-gray">8</p>
                </div>
                <Zap className="h-8 w-8 text-kic-purple" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">IoT Projects</TabsTrigger>
            <TabsTrigger value="events">Workshops & Events</TabsTrigger>
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
            <TabsTrigger value="lab">IoT Lab</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  IoT Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {iotProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-kic-gray">{project.title}</h4>
                        <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
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
                  Upcoming Workshops & Events
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
                        <Button size="sm">Join</Button>
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
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Arduino Documentation</h4>
                    <p className="text-sm text-gray-600">Complete Arduino programming guide and examples</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">ESP32 Projects</h4>
                    <p className="text-sm text-gray-600">Advanced ESP32 tutorials and project ideas</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">IoT Security Guidelines</h4>
                    <p className="text-sm text-gray-600">Best practices for securing IoT devices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lab">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  IoT Lab Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Arduino Uno (5 units)</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>ESP32 Dev Boards (3 units)</span>
                    <Badge variant="secondary">2 In Use</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Raspberry Pi 4 (2 units)</span>
                    <Badge variant="default">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Sensor Kits</span>
                    <Badge variant="default">Available</Badge>
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

export default IoTCommunityDashboard;
