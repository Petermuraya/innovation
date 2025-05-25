
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Briefcase, Calendar, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CareerOpportunityForm from './CareerOpportunityForm';

const CareerBoard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showForm, setShowForm] = useState(false);

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
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    return matchesSearch && matchesType;
  });

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

  if (loading) {
    return <div>Loading opportunities...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Career & Internship Board</h2>
        {user && (
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post Opportunity
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Search opportunities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="full_time">Full Time</SelectItem>
            <SelectItem value="part_time">Part Time</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
            <SelectItem value="volunteer">Volunteer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Opportunities Grid */}
      <div className="grid gap-6">
        {filteredOpportunities.map((opportunity) => (
          <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                  <p className="text-lg font-medium text-gray-700">{opportunity.company_name}</p>
                </div>
                <Badge className={getTypeColor(opportunity.type)}>
                  {opportunity.type.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{opportunity.description}</p>
              
              {opportunity.requirements && (
                <div>
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <p className="text-sm text-gray-600">{opportunity.requirements}</p>
                </div>
              )}

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

              <div className="flex gap-2 pt-2">
                {opportunity.application_url && (
                  <Button asChild>
                    <a href={opportunity.application_url} target="_blank" rel="noopener noreferrer">
                      Apply Now
                    </a>
                  </Button>
                )}
                {opportunity.application_email && (
                  <Button variant="outline" asChild>
                    <a href={`mailto:${opportunity.application_email}`}>
                      Email Application
                    </a>
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500">
                Posted by {opportunity.members?.name || 'Anonymous'}
              </p>
            </CardContent>
          </Card>
        ))}

        {filteredOpportunities.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No opportunities match your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Career Opportunity Form Modal */}
      {showForm && (
        <CareerOpportunityForm
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchOpportunities();
          }}
        />
      )}
    </div>
  );
};

export default CareerBoard;
