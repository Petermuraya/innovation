
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Template,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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

const NotificationTemplateManager = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const { toast } = useToast();

  const [templateForm, setTemplateForm] = useState({
    title: '',
    message: '',
    type: 'announcement',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
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

  const saveTemplate = async () => {
    if (!templateForm.title || !templateForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      if (editingTemplate) {
        const { error } = await supabase
          .from('notification_templates')
          .update({
            title: templateForm.title,
            message: templateForm.message,
            type: templateForm.type,
            priority: templateForm.priority,
            category: templateForm.category,
            is_active: templateForm.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Template updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('notification_templates')
          .insert({
            title: templateForm.title,
            message: templateForm.message,
            type: templateForm.type,
            priority: templateForm.priority,
            category: templateForm.category,
            is_active: templateForm.is_active
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Template created successfully",
        });
      }

      resetForm();
      await fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
      
      await fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (template?: NotificationTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        title: template.title,
        message: template.message,
        type: template.type,
        priority: template.priority,
        category: template.category,
        is_active: template.is_active
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setTemplateForm({
      title: '',
      message: '',
      type: 'announcement',
      priority: 'medium',
      category: 'general',
      is_active: true
    });
    setIsDialogOpen(false);
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
              <Template className="h-5 w-5 text-primary" />
              Notification Templates
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openEditDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={templateForm.title}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Template title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={templateForm.category}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="e.g., welcome, events, payments"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={templateForm.type}
                        onValueChange={(value) => setTemplateForm(prev => ({ ...prev, type: value }))}
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
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={templateForm.priority}
                        onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                          setTemplateForm(prev => ({ ...prev, priority: value }))
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={templateForm.message}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Template message content..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={templateForm.is_active}
                      onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={saveTemplate} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingTemplate ? 'Update' : 'Create'} Template
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No templates found. Create your first template to get started!
              </div>
            ) : (
              templates.map((template) => (
                <Card key={template.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{template.title}</h4>
                        <Badge variant="outline" className={getPriorityColor(template.priority)}>
                          {template.priority}
                        </Badge>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.message}</p>
                      <div className="flex gap-4 text-xs text-gray-400">
                        <span>Type: {template.type}</span>
                        <span>Category: {template.category}</span>
                        <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditDialog(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationTemplateManager;
