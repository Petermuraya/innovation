import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BlogManagement = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (member) {
      fetchBlogs();
    }
  }, [member]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Blog Management</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading blogs...</p>
          ) : (
            <div className="grid gap-4">
              {blogs.map((blog) => (
                <Card key={blog.id}>
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{blog.content.substring(0, 100)}...</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge>{blog.status}</Badge>
                      <Button>View</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
