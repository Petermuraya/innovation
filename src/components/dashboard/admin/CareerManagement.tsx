
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin, Briefcase, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import CareerOpportunityForm from '@/components/careers/CareerOpportunityForm';

const CareerManagement = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<any>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('career_opportunities')
        .select(`
          *,
          members!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Error loading career opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    try {
      const { error } = await supabase
        .from('career_opportunities')
        .delete()
        .eq('id', opportunityId);

      if (error) throw error;

      toast.success('Opportunity deleted successfully');
      fetchOpportunities();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Error deleting opportunity');
    }
  };

  const handleStatusToggle = async (opportunityId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    try {
      const { error } = await supabase
        .from('career_opportunities')
        .update({ status: newStatus })
        .eq('id', opportunityId);

      if (error) throw error;

      toast.success(`Opportunity ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchOpportunities();
    } catch (error) {
      console.error('Error updating opportunity status:', error);
      toast.error('Error updating opportunity status');
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      internship: 'bg-blue-100 text-blue-800',
      full_time: 'bg-green-100 text-green-800',
      part_time: 'bg-yellow-100 text-yellow-800',
      contract: 'bg-purple-100 text-purple-800',
      volunteer: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return <div>Loading career opportunities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Career Opportunities Management</h3>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Post New Opportunity
        </Button>
      </div>

      <div className="grid gap-4">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  <p className="text-gray-600">{opportunity.company_name}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(opportunity.type)}>
                    {opportunity.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(opportunity.status)}>
                    {opportunity.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{opportunity.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {opportunity.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {opportunity.location}
                    {opportunity.remote && ' (Remote)'}
                  </div>
                )}
                {opportunity.salary_range && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {opportunity.salary_range}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Posted {new Date(opportunity.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingOpportunity(opportunity)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusToggle(opportunity.id, opportunity.status)}
                  className={opportunity.status === 'active' ? 'text-red-600' : 'text-green-600'}
                >
                  {opportunity.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteOpportunity(opportunity.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>

              <p className="text-xs text-gray-500">
                Posted by {opportunity.members?.name || 'Unknown'}
              </p>
            </CardContent>
          </Card>
        ))}

        {opportunities.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No career opportunities posted yet.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Career Opportunity Form Modal */}
      {(showForm || editingOpportunity) && (
        <CareerOpportunityForm
          opportunity={editingOpportunity}
          onClose={() => {
            setShowForm(false);
            setEditingOpportunity(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingOpportunity(null);
            fetchOpportunities();
          }}
        />
      )}
    </div>
  );
};

export default CareerManagement;
