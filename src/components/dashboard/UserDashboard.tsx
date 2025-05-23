
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Calendar, CreditCard, FileText, GitBranch, User } from 'lucide-react';
import ProjectSubmissionForm from './ProjectSubmissionForm';
import NotificationsList from './NotificationsList';

const UserDashboard = () => {
  const { user, signOut } = useAuth();
  const [memberData, setMemberData] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch member data
      const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      setMemberData(member);

      // Fetch notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);
      setNotifications(notifs || []);

      // Fetch certificates
      const { data: certs } = await supabase
        .from('certificates')
        .select('*, events(title)')
        .eq('user_id', user?.id);
      setCertificates(certs || []);

      // Fetch project submissions
      const { data: projectSubmissions } = await supabase
        .from('project_submissions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      setProjects(projectSubmissions || []);

      // Fetch payment history
      const { data: paymentHistory } = await supabase
        .from('mpesa_payments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      setPayments(paymentHistory || []);

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5);
      setUpcomingEvents(events || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-kic-gray">Welcome back, {memberData?.name || user?.email}</h1>
          <p className="text-kic-gray/70">Manage your KIC membership and activities</p>
        </div>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Notifications</p>
                <p className="text-xl font-bold text-kic-gray">{notifications.filter(n => !n.is_read).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Projects</p>
                <p className="text-xl font-bold text-kic-gray">{projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Certificates</p>
                <p className="text-xl font-bold text-kic-gray">{certificates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-kic-green-500" />
              <div>
                <p className="text-sm text-kic-gray/70">Upcoming Events</p>
                <p className="text-xl font-bold text-kic-gray">{upcomingEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Recent Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NotificationsList notifications={notifications.slice(0, 5)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-kic-green-500 pl-4">
                      <h4 className="font-medium text-kic-gray">{event.title}</h4>
                      <p className="text-sm text-kic-gray/70">{new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-kic-gray/70">{event.location}</p>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <p className="text-kic-gray/70">No upcoming events</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <div className="space-y-6">
            <ProjectSubmissionForm onSuccess={fetchUserData} />
            
            <Card>
              <CardHeader>
                <CardTitle>My Project Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-kic-gray">{project.title}</h4>
                          <p className="text-sm text-kic-gray/70 mt-1">{project.description}</p>
                          <div className="flex space-x-2 mt-2">
                            {project.tech_tags?.map((tag: string, index: number) => (
                              <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <Badge variant={project.status === 'approved' ? 'default' : project.status === 'rejected' ? 'destructive' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-kic-gray/70">No project submissions yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Available Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-kic-gray">{event.title}</h4>
                        <p className="text-sm text-kic-gray/70 mt-1">{event.description}</p>
                        <p className="text-sm text-kic-gray/70">📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-kic-gray/70">📍 {event.location}</p>
                        {event.price > 0 && (
                          <p className="text-sm font-medium text-kic-green-600">KSh {event.price}</p>
                        )}
                      </div>
                      <Button className="bg-kic-green-500 hover:bg-kic-green-600">
                        Register
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-kic-gray">{cert.events?.title}</h4>
                      <p className="text-sm text-kic-gray/70">Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" asChild>
                      <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
                {certificates.length === 0 && (
                  <p className="text-kic-gray/70">No certificates yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-kic-gray">KSh {payment.amount}</h4>
                        <p className="text-sm text-kic-gray/70">{payment.payment_type}</p>
                        <p className="text-sm text-kic-gray/70">{new Date(payment.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge variant={payment.status === 'completed' ? 'default' : payment.status === 'failed' ? 'destructive' : 'secondary'}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {payments.length === 0 && (
                  <p className="text-kic-gray/70">No payment history</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-kic-gray">Name</label>
                  <p className="text-kic-gray/70">{memberData?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-kic-gray">Email</label>
                  <p className="text-kic-gray/70">{memberData?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-kic-gray">Phone</label>
                  <p className="text-kic-gray/70">{memberData?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-kic-gray">Course</label>
                  <p className="text-kic-gray/70">{memberData?.course || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-kic-gray">Registration Status</label>
                  <Badge variant={memberData?.registration_status === 'approved' ? 'default' : 'secondary'}>
                    {memberData?.registration_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
