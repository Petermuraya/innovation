
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import ElectionTestComponent from './ElectionTestComponent';

interface Election {
  id: string;
  title: string;
  description: string;
  status: string;
  nomination_start_date: string;
  nomination_end_date: string;
  voting_start_date: string;
  voting_end_date: string;
  created_at: string;
}

const ElectionsList = () => {
  const { user } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const { data, error } = await supabase
        .from('elections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching elections:', error);
        toast.error('Failed to load elections');
        return;
      }

      setElections(data || []);
    } catch (error) {
      console.error('Error fetching elections:', error);
      toast.error('Failed to load elections');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'nomination_open': return 'default';
      case 'voting_open': return 'destructive';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'voting_open': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading elections...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Test Component - Remove this in production */}
      <ElectionTestComponent />
      
      {elections.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              No Active Elections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              There are currently no elections scheduled. Check back later or contact an administrator.
            </p>
            <div className="bg-kic-green-50 border border-kic-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-kic-green-800 mb-2">What are elections?</h4>
              <p className="text-sm text-kic-green-700">
                Elections allow club members to democratically choose their leadership. 
                When elections are active, you'll be able to view candidates, cast your vote, 
                and even apply to become a candidate yourself.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {elections.map((election) => (
            <Card key={election.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(election.status)}
                      {election.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{election.description}</p>
                  </div>
                  <Badge variant={getStatusColor(election.status) as any}>
                    {election.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-kic-blue-600" />
                      <span className="font-medium">Nomination Period:</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      {new Date(election.nomination_start_date).toLocaleDateString()} - {' '}
                      {new Date(election.nomination_end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-kic-green-600" />
                      <span className="font-medium">Voting Period:</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      {new Date(election.voting_start_date).toLocaleDateString()} - {' '}
                      {new Date(election.voting_end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {election.status === 'voting_open' && (
                    <Button size="sm" className="bg-kic-green-600 hover:bg-kic-green-700">
                      Vote Now
                    </Button>
                  )}
                  {election.status === 'nomination_open' && (
                    <Button size="sm" variant="outline">
                      Apply as Candidate
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElectionsList;
