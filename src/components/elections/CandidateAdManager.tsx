
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Plus, Edit, Trash2, Eye, MousePointer } from 'lucide-react';

interface CandidateAd {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  display_priority: number;
  is_active: boolean;
  impressions_count: number;
  clicks_count: number;
  created_at: string;
  expires_at?: string;
}

const CandidateAdManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ads, setAds] = useState<CandidateAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<CandidateAd | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image_url: '',
    video_url: '',
    display_priority: 1,
    expires_at: ''
  });

  const fetchUserAds = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('election_advertisements')
        .select(`
          *,
          election_candidates!inner(
            user_id,
            position_type,
            elections!inner(title, status)
          )
        `)
        .eq('election_candidates.user_id', user.id);

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your advertisements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Get user's candidate record
      const { data: candidateData, error: candidateError } = await supabase
        .from('election_candidates')
        .select('id, election_id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();

      if (candidateError || !candidateData) {
        toast({
          title: "Error",
          description: "You don't have an approved candidacy",
          variant: "destructive",
        });
        return;
      }

      const adData = {
        ...formData,
        candidate_id: candidateData.id,
        election_id: candidateData.election_id,
        expires_at: formData.expires_at || null
      };

      if (editingAd) {
        const { error } = await supabase
          .from('election_advertisements')
          .update(adData)
          .eq('id', editingAd.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Advertisement updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('election_advertisements')
          .insert([adData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Advertisement created successfully",
        });
      }

      setFormData({
        title: '',
        content: '',
        image_url: '',
        video_url: '',
        display_priority: 1,
        expires_at: ''
      });
      setEditingAd(null);
      fetchUserAds();
    } catch (error) {
      console.error('Error saving ad:', error);
      toast({
        title: "Error",
        description: "Failed to save advertisement",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (ad: CandidateAd) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      content: ad.content,
      image_url: ad.image_url || '',
      video_url: ad.video_url || '',
      display_priority: ad.display_priority,
      expires_at: ad.expires_at ? ad.expires_at.split('T')[0] : ''
    });
  };

  const handleDelete = async (adId: string) => {
    try {
      const { error } = await supabase
        .from('election_advertisements')
        .delete()
        .eq('id', adId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Advertisement deleted successfully",
      });
      fetchUserAds();
    } catch (error) {
      console.error('Error deleting ad:', error);
      toast({
        title: "Error",
        description: "Failed to delete advertisement",
        variant: "destructive",
      });
    }
  };

  const toggleAdStatus = async (adId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('election_advertisements')
        .update({ is_active: !currentStatus })
        .eq('id', adId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Advertisement ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
      fetchUserAds();
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast({
        title: "Error",
        description: "Failed to update advertisement status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUserAds();
  }, [user]);

  if (loading) {
    return <div className="text-center py-8">Loading your advertisements...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Manage Campaign Advertisements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Advertisement title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority (1-10)</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.display_priority}
                  onChange={(e) => setFormData({ ...formData, display_priority: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Advertisement content"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Video URL</label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expires At (optional)</label>
              <Input
                type="date"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingAd ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingAd ? 'Update' : 'Create'} Advertisement
              </Button>
              {editingAd && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingAd(null);
                    setFormData({
                      title: '',
                      content: '',
                      image_url: '',
                      video_url: '',
                      display_priority: 1,
                      expires_at: ''
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Advertisements</h3>
        {ads.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No advertisements created yet. Create your first campaign ad above!
            </CardContent>
          </Card>
        ) : (
          ads.map((ad) => (
            <Card key={ad.id} className={`${ad.is_active ? 'border-green-200' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{ad.title}</h4>
                  <div className="flex gap-2">
                    <Badge variant={ad.is_active ? "default" : "secondary"}>
                      {ad.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">Priority: {ad.display_priority}</Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{ad.content}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {ad.impressions_count} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MousePointer className="w-3 h-3" />
                      {ad.clicks_count} clicks
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Created: {new Date(ad.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(ad)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant={ad.is_active ? "secondary" : "default"}
                    onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                  >
                    {ad.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(ad.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CandidateAdManager;
