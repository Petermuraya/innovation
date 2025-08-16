import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogDraft {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export const useBlogDrafts = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<BlogDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrafts = async () => {
    if (!member) return;
    
    try {
      const { data, error } = await supabase
        .from('blog_drafts')
        .select('*')
        .eq('user_id', member.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDrafts((data || []).map(draft => ({
        ...draft,
        status: draft.status as 'draft' | 'submitted' | 'approved' | 'rejected'
      })));
    } catch (error) {
      console.error('Error fetching blog drafts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog drafts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDraft = async (draftData: Partial<BlogDraft>) => {
    if (!member) return null;

    try {
      const { data, error } = await supabase
        .from('blog_drafts')
        .insert({
          user_id: member.id,
          ...draftData,
        })
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Blog draft created successfully",
      });

      return data;
    } catch (error) {
      console.error('Error creating blog draft:', error);
      toast({
        title: "Error",
        description: "Failed to create blog draft",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateDraft = async (id: string, updates: Partial<BlogDraft>) => {
    try {
      const { data, error } = await supabase
        .from('blog_drafts')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => prev.map(draft => 
        draft.id === id ? { ...draft, ...data } : draft
      ));

      toast({
        title: "Success",
        description: "Blog draft updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating blog draft:', error);
      toast({
        title: "Error",
        description: "Failed to update blog draft",
        variant: "destructive",
      });
      return null;
    }
  };

  const submitForReview = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_drafts')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDrafts(prev => prev.map(draft => 
        draft.id === id ? { ...draft, ...data } : draft
      ));

      toast({
        title: "Success",
        description: "Blog post submitted for admin review",
      });

      return data;
    } catch (error) {
      console.error('Error submitting blog for review:', error);
      toast({
        title: "Error",
        description: "Failed to submit blog for review",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteDraft = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDrafts(prev => prev.filter(draft => draft.id !== id));
      toast({
        title: "Success",
        description: "Blog draft deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting blog draft:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog draft",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [member]);

  return {
    drafts,
    loading,
    createDraft,
    updateDraft,
    submitForReview,
    deleteDraft,
    refetch: fetchDrafts,
  };
};