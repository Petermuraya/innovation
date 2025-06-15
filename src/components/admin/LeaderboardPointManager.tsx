
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save, Plus, Edit2, Trash2, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PointConfiguration {
  id: string;
  activity_type: string;
  points_value: number;
  description: string;
  is_active: boolean;
}

const COMMON_ACTIVITIES = [
  { type: 'blog_creation', label: 'Blog Creation', defaultPoints: 20 },
  { type: 'project_submission', label: 'Project Submission', defaultPoints: 50 },
  { type: 'event_attendance', label: 'Event Attendance', defaultPoints: 15 },
  { type: 'community_visit', label: 'Community Visit', defaultPoints: 5 },
  { type: 'website_visit', label: 'Daily Website Visit', defaultPoints: 2 },
  { type: 'blog_like', label: 'Blog Like', defaultPoints: 1 },
  { type: 'project_like', label: 'Project Like', defaultPoints: 2 },
  { type: 'comment_creation', label: 'Comment Creation', defaultPoints: 3 },
  { type: 'newsletter_subscription', label: 'Newsletter Subscription', defaultPoints: 10 },
  { type: 'admin_bonus', label: 'Admin Bonus Points', defaultPoints: 25 },
];

const LeaderboardPointManager = () => {
  const [configurations, setConfigurations] = useState<PointConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState<PointConfiguration | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('point_configurations')
        .select('*')
        .order('activity_type');

      if (error) throw error;
      setConfigurations(data || []);
    } catch (error) {
      console.error('Error fetching point configurations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch point configurations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (config: Partial<PointConfiguration>) => {
    try {
      if (config.id) {
        // Update existing configuration
        const { error } = await supabase
          .from('point_configurations')
          .update({
            activity_type: config.activity_type,
            points_value: config.points_value,
            description: config.description,
            is_active: config.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', config.id);

        if (error) throw error;
      } else {
        // Create new configuration
        const { error } = await supabase
          .from('point_configurations')
          .insert({
            activity_type: config.activity_type,
            points_value: config.points_value,
            description: config.description,
            is_active: config.is_active ?? true
          });

        if (error) throw error;
      }

      await fetchConfigurations();
      setIsDialogOpen(false);
      setEditingConfig(null);
      
      toast({
        title: "Success",
        description: `Point configuration ${config.id ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      console.error('Error saving point configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save point configuration",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('point_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchConfigurations();
      toast({
        title: "Success",
        description: "Point configuration deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting point configuration:', error);
      toast({
        title: "Error",
        description: "Failed to delete point configuration",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('point_configurations')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      await fetchConfigurations();
      toast({
        title: "Success",
        description: `Point configuration ${isActive ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating point configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update point configuration",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (config?: PointConfiguration) => {
    setEditingConfig(config || {
      id: '',
      activity_type: '',
      points_value: 0,
      description: '',
      is_active: true
    });
    setIsDialogOpen(true);
  };

  const addQuickConfig = (activity: typeof COMMON_ACTIVITIES[0]) => {
    setEditingConfig({
      id: '',
      activity_type: activity.type,
      points_value: activity.defaultPoints,
      description: `Points awarded for ${activity.label.toLowerCase()}`,
      is_active: true
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading point configurations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Leaderboard Point System Configuration
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openEditDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingConfig?.id ? 'Edit' : 'Create'} Point Configuration
                </DialogTitle>
              </DialogHeader>
              <PointConfigForm
                config={editingConfig}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Add Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Quick Add Common Activities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {COMMON_ACTIVITIES.filter(activity => 
              !configurations.find(config => config.activity_type === activity.type)
            ).map((activity) => (
              <Button
                key={activity.type}
                variant="outline"
                size="sm"
                onClick={() => addQuickConfig(activity)}
                className="justify-start text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {activity.label} ({activity.defaultPoints}p)
              </Button>
            ))}
          </div>
        </div>

        {/* Current Configurations */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Current Point Configurations</h3>
          {configurations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No point configurations found. Add some to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {configurations.map((config) => (
                <div
                  key={config.id}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    config.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="font-semibold capitalize">
                          {config.activity_type.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-gray-600">{config.description}</p>
                      </div>
                      <Badge variant={config.is_active ? "default" : "secondary"}>
                        {config.points_value} points
                      </Badge>
                      <Switch
                        checked={config.is_active}
                        onCheckedChange={(checked) => toggleActive(config.id, checked)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(config)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(config.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface PointConfigFormProps {
  config: PointConfiguration | null;
  onSave: (config: Partial<PointConfiguration>) => void;
  onCancel: () => void;
}

const PointConfigForm: React.FC<PointConfigFormProps> = ({ config, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    activity_type: config?.activity_type || '',
    points_value: config?.points_value || 0,
    description: config?.description || '',
    is_active: config?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      ...formData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="activity_type">Activity Type</Label>
        <Input
          id="activity_type"
          value={formData.activity_type}
          onChange={(e) => setFormData(prev => ({ ...prev, activity_type: e.target.value }))}
          placeholder="e.g., blog_creation, project_submission"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="points_value">Points Value</Label>
        <Input
          id="points_value"
          type="number"
          value={formData.points_value}
          onChange={(e) => setFormData(prev => ({ ...prev, points_value: parseInt(e.target.value) || 0 }))}
          min="0"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description of this point configuration"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default LeaderboardPointManager;
