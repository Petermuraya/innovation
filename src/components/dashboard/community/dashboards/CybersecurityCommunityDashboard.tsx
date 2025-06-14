import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Shield, Lock, AlertTriangle, Bug, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommunityGroup } from '../../user/communities/useCommunityData';

interface CybersecurityCommunityDashboardProps {
  community: CommunityGroup;
}

const CybersecurityCommunityDashboard = ({ community }: CybersecurityCommunityDashboardProps) => {
  const navigate = useNavigate();

  const securityProjects = [
    {
      id: 1,
      title: "Vulnerability Scanner",
      description: "Automated web application security scanning tool",
      status: "Active",
      severity: "High",
      tech: ["Python", "Nmap", "SQLMap", "OWASP ZAP"]
    },
    {
      id: 2,
      title: "Phishing Detection System",
      description: "Machine learning based phishing email detection",
      status: "Completed",
      severity: "Medium",
      tech: ["Python", "Scikit-learn", "TensorFlow"]
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Ethical Hacking Workshop",
      date: "2024-06-21",
      time: "2:00 PM",
      description: "Learn penetration testing techniques ethically"
    },
    {
      id: 2,
      title: "Cryptography Fundamentals",
      date: "2024-06-26",
      time: "4:00 PM",
      description: "Understanding encryption and digital signatures"
    }
  ];

  const threatAlerts = [
    {
      id: 1,
      title: "New Ransomware Variant Detected",
      severity: "Critical",
      date: "2024-06-15"
    },
    {
      id: 2,
      title: "Campus WiFi Security Update",
      severity: "Medium",
      date: "2024-06-14"
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
            <p className="text-kic-gray/70">Cybersecurity & Information Security</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Experts</p>
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
                  <p className="text-sm font-medium text-gray-600">Security Projects</p>
                  <p className="text-2xl font-bold text-kic-gray">{securityProjects.length}</p>
                </div>
                <Shield className="h-8 w-8 text-kic-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vulnerabilities Found</p>
                  <p className="text-2xl font-bold text-kic-gray">23</p>
                </div>
                <Bug className="h-8 w-8 text-kic-orange" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Threats</p>
                  <p className="text-2xl font-bold text-red-600">2</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Security Projects</TabsTrigger>
            <TabsTrigger value="events">Training & CTF</TabsTrigger>
            <TabsTrigger value="resources">Security Tools</TabsTrigger>
            <TabsTrigger value="alerts">Threat Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Active Security Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-kic-gray">{project.title}</h4>
                        <div className="flex gap-2">
                          <Badge variant={
                            project.severity === 'High' ? 'destructive' : 
                            project.severity === 'Medium' ? 'default' : 'secondary'
                          }>
                            {project.severity}
                          </Badge>
                          <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
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
                        <Button size="sm" variant="outline">View Report</Button>
                        <Button size="sm">Run Scan</Button>
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
                  Security Training & CTF Events
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
                        <Button size="sm">Participate</Button>
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
                <CardTitle>Security Tools & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Penetration Testing Tools</h4>
                    <p className="text-sm text-gray-600">Kali Linux, Metasploit, Burp Suite, Nmap</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Vulnerability Assessment</h4>
                    <p className="text-sm text-gray-600">OWASP ZAP, OpenVAS, Nikto, SQLMap</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Network Security</h4>
                    <p className="text-sm text-gray-600">Wireshark, pfSense, Snort, tcpdump</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Digital Forensics</h4>
                    <p className="text-sm text-gray-600">Autopsy, Volatility, FTK Imager, dd</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Security Threat Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {threatAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-kic-gray">{alert.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                        </div>
                        <Badge variant={
                          alert.severity === 'Critical' ? 'destructive' : 
                          alert.severity === 'High' ? 'destructive' : 
                          alert.severity === 'Medium' ? 'default' : 'secondary'
                        }>
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-4">
                    <Button variant="outline" size="sm">
                      <Lock className="w-4 h-4 mr-2" />
                      View All Security Bulletins
                    </Button>
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

export default CybersecurityCommunityDashboard;
