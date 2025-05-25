
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProjectInteractions = (projectId: string) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchInteractions();
    }
  }, [projectId, user]);

  const fetchInteractions = async () => {
    try {
      // Fetch likes
      const { data: likesData } = await supabase
        .from('project_likes')
        .select('*')
        .eq('project_id', projectId);
      
      setLikes(likesData || []);
      setHasLiked(likesData?.some(like => like.user_id === user?.id) || false);

      // Fetch comments with user info
      const { data: commentsData } = await supabase
        .from('project_comments')
        .select(`
          *,
          members!inner(name)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      
      setComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!user) {
      toast.error('Please login to like projects');
      return;
    }

    try {
      if (hasLiked) {
        await supabase
          .from('project_likes')
          .delete()
          .eq('project_id', projectId)
          .eq('user_id', user.id);
        
        setHasLiked(false);
        setLikes(prev => prev.filter(like => like.user_id !== user.id));
      } else {
        await supabase
          .from('project_likes')
          .insert({ project_id: projectId, user_id: user.id });
        
        setHasLiked(true);
        setLikes(prev => [...prev, { project_id: projectId, user_id: user.id }]);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Error updating like');
    }
  };

  const addComment = async (content: string) => {
    if (!user || !content.trim()) return;

    try {
      const { data, error } = await supabase
        .from('project_comments')
        .insert({ 
          project_id: projectId, 
          user_id: user.id, 
          content: content.trim() 
        })
        .select(`
          *,
          members!inner(name)
        `)
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  return {
    likes,
    comments,
    hasLiked,
    loading,
    toggleLike,
    addComment,
    likesCount: likes.length
  };
};
