import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Plus, Clock, Send } from 'lucide-react';

interface CommunityRemindersTabProps {
  communityId: string;
  isAdmin?: boolean;
}

const CommunityRemindersTab = ({ communityId, isAdmin = false }: CommunityRemindersTabProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    title: '',
    message: '',
    reminder_type: 'general',
    scheduled_for: '',
  });

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('community_reminders')
        .select('*')
        .eq('community_id', communityId)
        .order('scheduled_for', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReminder = async () => {
    if (!reminderForm.title || !reminderForm.message || !reminderForm.scheduled_for) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_reminders')
        .insert({
          community_id: communityId,
          title: reminderForm.title,
          message: reminderForm.message,
          reminder_type: reminderForm.reminder_type,
          scheduled_for: reminderForm.scheduled_for,
          created_by: user?.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reminder scheduled successfully",
      });

      setShowCreateDialog(false);
      setReminderForm({ title: '', message: '', reminder_type: 'general', scheduled_for: '' });
      fetchReminders();
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast({
        title: "Error",
        description: "Failed to create reminder",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [communityId]);

  if (loading) {
    return <div className="text-center py-8">Loading reminders...</div>;
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Community Reminders ({reminders.length})
        </CardTitle>
        {isAdmin && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Community Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={reminderForm.title}
                    onChange={(e) => setReminderForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Reminder title"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={reminderForm.message}
                    onChange={(e) => setReminderForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Reminder message"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={reminderForm.reminder_type} onValueChange={(value) => 
                    setReminderForm(prev => ({ ...prev, reminder_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduled_for">Schedule For *</Label>
                  <Input
                    id="scheduled_for"
                    type="datetime-local"
                    value={reminderForm.scheduled_for}
                    onChange={(e) => setReminderForm(prev => ({ ...prev, scheduled_for: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createReminder}>
                    Schedule Reminder
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div key={reminder.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-kic-gray">{reminder.title}</h4>
                    <Badge className={getTypeBadgeColor(reminder.reminder_type)}>
                      {reminder.reminder_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{reminder.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Scheduled: {new Date(reminder.scheduled_for).toLocaleString()}
                    </div>
                    {reminder.sent_at && (
                      <div className="flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        Sent: {new Date(reminder.sent_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(reminder.status)}>
                  {reminder.status}
                </Badge>
              </div>
            </div>
          ))}
          {reminders.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reminders</h3>
              <p className="text-gray-500">No reminders have been scheduled yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityRemindersTab;
