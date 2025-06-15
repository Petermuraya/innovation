
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Send, 
  Users, 
  User, 
  Building, 
  Plus, 
  Edit, 
  Trash2, 
  Clock,
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  is_active: boolean;
  created_at: string;
}

interface Community {
  id: string;
  name: string;
}

interface Member {
  user_id: string;
  name: string;
  email: string;
}

const AdminNotificationManager = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'announcement',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    targetType: 'all' as 'all' | 'individual' | 'community',
    targetIds: [] as string[],
    scheduledFor: '',
    metadata: {}
  });

  useEffect(() => {
    fetchTemplates();
    fetchCommunities();
    fetchMembers();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch notification templates",
        variant: "destructive",
      });
    }
  };

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('user_id, name, email')
        .eq('registration_status', 'approved')
        .order('name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const sendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('send_bulk_notification', {
        p_title: notificationForm.title,
        p_message: notificationForm.message,
        p_type: notificationForm.type,
        p_priority: notificationForm.priority,
        p_target_type: notificationForm.targetType,
        p_target_ids: notificationForm.targetIds.length > 0 ? notificationForm.targetIds : null,
        p_scheduled_for: notificationForm.scheduledFor || null,
        p_metadata: notificationForm.metadata
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: notificationForm.scheduledFor 
          ? "Notification scheduled successfully" 
          : "Notification sent successfully",
      });

      setNotificationForm({
        title: '',
        message: '',
        type: 'announcement',
        priority: 'medium',
        targetType: 'all',
        targetIds: [],
        scheduledFor: '',
        metadata: {}
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = (template: NotificationTemplate) => {
    setNotificationForm(prev => ({
      ...prev,
      title: template.title,
      message: template.message,
      type: template.type,
      priority: template.priority
    }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'achievement': return <CheckCircle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Management System
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Send New Notification</DialogTitle>
                </DialogHeader>
                
                <Tabs defaultValue="compose" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compose">Compose</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="compose" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={notificationForm.title}
                          onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Notification title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                          value={notificationForm.type}
                          onValueChange={(value) => setNotificationForm(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="announcement">Announcement</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="alert">Alert</SelectItem>
                            <SelectItem value="info">Information</SelectItem>
                            <SelectItem value="achievement">Achievement</SelectItem>
                            <SelectItem value="payment">Payment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={notificationForm.priority}
                          onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                            setNotificationForm(prev => ({ ...prev, priority: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetType">Send To</Label>
                        <Select
                          value={notificationForm.targetType}
                          onValueChange={(value: 'all' | 'individual' | 'community') => 
                            setNotificationForm(prev => ({ ...prev, targetType: value, targetIds: [] }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                All Members
                              </div>
                            </SelectItem>
                            <SelectItem value="individual">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Specific Users
                              </div>
                            </SelectItem>
                            <SelectItem value="community">
                              <div className="flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                Communities
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {notificationForm.targetType === 'individual' && (
                      <div className="space-y-2">
                        <Label>Select Members</Label>
                        <div className="border rounded-md p-3 max-h-32 overflow-y-auto space-y-1">
                          {members.map((member) => (
                            <label key={member.user_id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationForm.targetIds.includes(member.user_id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNotificationForm(prev => ({
                                      ...prev,
                                      targetIds: [...prev.targetIds, member.user_id]
                                    }));
                                  } else {
                                    setNotificationForm(prev => ({
                                      ...prev,
                                      targetIds: prev.targetIds.filter(id => id !== member.user_id)
                                    }));
                                  }
                                }}
                              />
                              <span className="text-sm">{member.name} ({member.email})</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {notificationForm.targetType === 'community' && (
                      <div className="space-y-2">
                        <Label>Select Communities</Label>
                        <div className="border rounded-md p-3 space-y-1">
                          {communities.map((community) => (
                            <label key={community.id} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notificationForm.targetIds.includes(community.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNotificationForm(prev => ({
                                      ...prev,
                                      targetIds: [...prev.targetIds, community.id]
                                    }));
                                  } else {
                                    setNotificationForm(prev => ({
                                      ...prev,
                                      targetIds: prev.targetIds.filter(id => id !== community.id)
                                    }));
                                  }
                                }}
                              />
                              <span className="text-sm">{community.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={notificationForm.message}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Write your notification message..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
                      <Input
                        id="scheduledFor"
                        type="datetime-local"
                        value={notificationForm.scheduledFor}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, scheduledFor: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={sendNotification} disabled={loading}>
                        {loading ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        {notificationForm.scheduledFor ? 'Schedule' : 'Send'} Notification
                      </Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="templates" className="space-y-4">
                    <div className="space-y-3">
                      {templates.map((template) => (
                        <Card key={template.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getTypeIcon(template.type)}
                                <h4 className="font-semibold">{template.title}</h4>
                                <Badge variant="outline" className={getPriorityColor(template.priority)}>
                                  {template.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{template.message}</p>
                              <p className="text-xs text-gray-400">Category: {template.category}</p>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => useTemplate(template)}
                              className="ml-4"
                            >
                              Use Template
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">Broadcast to All</h3>
              <p className="text-sm text-gray-600">Send to all approved members</p>
            </Card>
            <Card className="p-4 text-center">
              <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">Individual Targeting</h3>
              <p className="text-sm text-gray-600">Send to specific users</p>
            </Card>
            <Card className="p-4 text-center">
              <Building className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">Community Focus</h3>
              <p className="text-sm text-gray-600">Target specific communities</p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationManager;
