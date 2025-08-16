import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Eye, Trash2, Send, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { useBlogDrafts } from './hooks/useBlogDrafts';
import { motion } from 'framer-motion';

const DashboardBlogs = () => {
  const { drafts, loading, createDraft, updateDraft, submitForReview, deleteDraft } = useBlogDrafts();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      tags: '',
    });
    setEditingDraft(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const draftData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (editingDraft) {
      await updateDraft(editingDraft.id, draftData);
    } else {
      await createDraft(draftData);
    }

    resetForm();
    setIsCreateOpen(false);
  };

  const handleEdit = (draft: any) => {
    setEditingDraft(draft);
    setFormData({
      title: draft.title,
      content: draft.content,
      excerpt: draft.excerpt || '',
      tags: draft.tags?.join(', ') || '',
    });
    setIsCreateOpen(true);
  };

  const handleSubmitForReview = async (id: string) => {
    if (confirm('Are you sure you want to submit this blog for admin review?')) {
      await submitForReview(id);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog draft?')) {
      await deleteDraft(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const, icon: FileText },
      submitted: { label: 'Under Review', variant: 'default' as const, icon: Clock },
      approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Blog Posts</h1>
          <p className="text-gray-600 mt-1">Create, manage, and submit your blog posts for publication</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDraft ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
              <DialogDescription>
                Write your blog post. Once ready, you can submit it for admin review and publication.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog post title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of your blog post"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your blog post content here..."
                  rows={12}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas (e.g., react, javascript, web development)"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDraft ? 'Update Draft' : 'Save Draft'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {drafts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
            <p className="text-gray-600 text-center mb-4">
              Start sharing your knowledge and experiences with the community
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Write Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {drafts.map((draft, index) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{draft.title}</CardTitle>
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(draft.status)}
                        <span className="text-sm text-gray-500">
                          Updated {new Date(draft.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      {draft.excerpt && (
                        <CardDescription className="text-gray-600">
                          {draft.excerpt}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  
                  {draft.tags && draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {draft.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(draft)}
                      disabled={draft.status === 'submitted' || draft.status === 'approved'}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    {draft.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleSubmitForReview(draft.id)}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Submit for Review
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(draft.id)}
                      disabled={draft.status === 'approved'}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                  
                  {draft.status === 'rejected' && draft.rejection_reason && (
                    <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
                      <p className="text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {draft.rejection_reason}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardBlogs;