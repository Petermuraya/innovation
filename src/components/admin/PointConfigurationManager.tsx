
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save, Plus, Edit2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PointConfiguration {
  id: string;
  activity_type: string;
  points_value: number;
  description: string;
  is_active: boolean;
}

const PointConfigurationManager = () => {
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
            is_active: config.is_active || true
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

  if (loading) {
    return <div className="text-center py-8">Loading point configurations...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Point Configuration Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openEditDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </DialogTrigger>
            <DialogContent>
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
      <CardContent>
        <div className="space-y-4">
          {configurations.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-semibold">{config.activity_type.replace(/_/g, ' ').toUpperCase()}</h3>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{config.points_value}</div>
                    <div className="text-xs text-gray-500">Points</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={config.is_active} disabled />
                    <span className="text-sm">{config.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
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
          placeholder="e.g., event_attendance"
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

export default PointConfigurationManager;
