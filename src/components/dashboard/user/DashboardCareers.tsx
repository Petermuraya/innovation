
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Building, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CareerOpportunity {
  id: string;
  title: string;
  company_name: string;
  description: string;
  location?: string;
  type: string;
  salary_range?: string;
  remote: boolean;
  application_url?: string;
  application_email?: string;
  expires_at?: string;
  created_at: string;
}

const DashboardCareers = () => {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('career_opportunities')
        .select('*')
        .eq('status', 'active')
        .or('expires_at.is.null,expires_at.gte.' + new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching career opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load career opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (opportunity: CareerOpportunity) => {
    if (opportunity.application_url) {
      window.open(opportunity.application_url, '_blank');
    } else if (opportunity.application_email) {
      window.location.href = `mailto:${opportunity.application_email}?subject=Application for ${opportunity.title}`;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading career opportunities...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-kic-gray">{opportunity.title}</h4>
                    <Badge variant="secondary">{opportunity.type}</Badge>
                    {opportunity.remote && (
                      <Badge variant="outline">Remote</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-kic-gray">{opportunity.company_name}</span>
                  </div>
                  
                  <p className="text-sm text-kic-gray/70 mb-3">{opportunity.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-kic-gray/70 mb-3">
                    {opportunity.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {opportunity.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Posted {new Date(opportunity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {opportunity.salary_range && (
                    <div className="text-sm font-medium text-kic-green-600 mb-3">
                      {opportunity.salary_range}
                    </div>
                  )}
                  
                  {opportunity.expires_at && (
                    <div className="text-sm text-orange-600 mb-3">
                      Expires: {new Date(opportunity.expires_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {(opportunity.application_url || opportunity.application_email) && (
                    <Button 
                      className="bg-kic-green-500 hover:bg-kic-green-600 flex items-center gap-2"
                      onClick={() => handleApply(opportunity)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {opportunities.length === 0 && (
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-kic-gray/70">No career opportunities available at the moment.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCareers;
