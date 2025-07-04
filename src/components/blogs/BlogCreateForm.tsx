import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Video, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import BlogAttachmentUpload from './BlogAttachmentUpload';

const BlogCreateForm = () => {
  const { member } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleTagAdd = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleAttachmentChange = (files: File[]) => {
    setAttachments(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!member) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create a blog post",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let featuredImagePath: string | null = null;
      let videoPath: string | null = null;

      // Upload featured image
      if (featuredImage) {
        const { data, error } = await supabase.storage
          .from('blog-images')
          .upload(`${member.id}/${Date.now()}-${featuredImage.name}`, featuredImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        featuredImagePath = data.path;
      }

      // Upload video file
      if (videoFile) {
        const { data, error } = await supabase.storage
          .from('blog-videos')
          .upload(`${member.id}/${Date.now()}-${videoFile.name}`, videoFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        videoPath = data.path;
      }

      // Upload attachments
      const attachmentPaths: string[] = [];
      for (const attachment of attachments) {
        const { data, error } = await supabase.storage
          .from('blog-attachments')
          .upload(`${member.id}/${Date.now()}-${attachment.name}`, attachment, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;
        attachmentPaths.push(data.path);
      }

      // Create blog post
      const { error: blogError } = await supabase
        .from('blogs')
        .insert({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim(),
          tags: tags,
          featured_image: featuredImagePath,
          video_url: videoPath || videoUrl,
          status: 'draft',
          admin_verified: false,
          user_id: member.id,
          attachment_paths: attachmentPaths,
        });

      if (blogError) throw blogError;

      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      navigate('/dashboard/admin/blog-management');
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Blog Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Excerpt (Short Description)"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </div>

            {/* Tags Input */}
            <div>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleTagAdd}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} className="mr-2 mt-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 -mr-1 h-5 w-5"
                      onClick={() => handleTagRemove(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Featured Image
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedImageChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                {featuredImage && (
                  <span className="ml-2 text-gray-500">{featuredImage.name}</span>
                )}
              </div>
            </div>

            {/* Video Upload or URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Video Upload (or URL)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                  ref={videoInputRef}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
                {videoFile && (
                  <span className="ml-2 text-gray-500">{videoFile.name}</span>
                )}
                <div>
                  <Input
                    type="url"
                    placeholder="Or enter video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Attachment Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <BlogAttachmentUpload onAttachmentsChange={handleAttachmentChange} />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Blog Post'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCreateForm;
