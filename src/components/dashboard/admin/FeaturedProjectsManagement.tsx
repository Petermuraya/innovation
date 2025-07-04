import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const FeaturedProjectsManagement = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeaturedProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('featured_projects')
        .select('*');

      if (error) {
        throw error;
      }

      setFeaturedProjects(data || []);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
      toast({
        title: "Error",
        description: "Failed to load featured projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (member) {
      fetchFeaturedProjects();
    }
  }, [member]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Projects Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {featuredProjects.map((project) => (
              <li key={project.id}>
                {project.title}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default FeaturedProjectsManagement;
