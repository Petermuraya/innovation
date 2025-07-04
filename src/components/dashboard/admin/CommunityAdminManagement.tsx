import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CommunityAdminManagement = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [communityAdmins, setCommunityAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCommunityAdmins = async () => {
    setLoading(true);
    try {
      // Fetch community admins from the database
      const { data, error } = await supabase
        .from('community_admins')
        .select('*');

      if (error) {
        throw error;
      }

      setCommunityAdmins(data || []);
    } catch (error) {
      console.error('Error fetching community admins:', error);
      toast({
        title: "Error",
        description: "Failed to load community admins",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (member) {
      fetchCommunityAdmins();
    }
  }, [member]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Admin Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {communityAdmins.map((admin) => (
              <li key={admin.id}>
                {admin.name} - {admin.email}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunityAdminManagement;
