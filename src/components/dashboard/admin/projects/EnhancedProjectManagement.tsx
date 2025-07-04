import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const EnhancedProjectManagement = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*');

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (member) {
      fetchProjects();
    }
  }, [member]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Management</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading projects...</div>
        ) : (
          <ul>
            {projects.map((project: any) => (
              <li key={project.id}>
                {project.title} - {project.description}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedProjectManagement;
