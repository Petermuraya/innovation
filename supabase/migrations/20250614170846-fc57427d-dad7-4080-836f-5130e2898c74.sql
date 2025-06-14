
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view blog likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Anyone can view comments on published blogs" ON public.blog_comments;
DROP POLICY IF EXISTS "Registered members can create comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Users can manage their own comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Anyone can view published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can view their own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Registered members can create blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can update their own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Users can delete their own blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can manage all blogs" ON public.blogs;

-- Add featured_image and video_url columns to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS featured_image_size bigint,
ADD COLUMN IF NOT EXISTS video_size bigint;

-- Create blog_attachments table for better file management
CREATE TABLE IF NOT EXISTS public.blog_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id uuid NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_type text NOT NULL CHECK (file_type IN ('image', 'video')),
  file_size bigint NOT NULL,
  file_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.blog_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_attachments
CREATE POLICY "Users can view published blog attachments" 
ON public.blog_attachments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.blogs 
    WHERE blogs.id = blog_attachments.blog_id 
    AND blogs.status = 'published' 
    AND blogs.admin_verified = true
  )
);

CREATE POLICY "Users can manage their own blog attachments" 
ON public.blog_attachments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.blogs 
    WHERE blogs.id = blog_attachments.blog_id 
    AND blogs.user_id = auth.uid()
  )
);

-- Create policies for blog_likes
CREATE POLICY "Anyone can view blog likes" 
ON public.blog_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own likes" 
ON public.blog_likes 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for blog_comments
CREATE POLICY "Anyone can view comments on published blogs" 
ON public.blog_comments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.blogs 
    WHERE blogs.id = blog_comments.blog_id 
    AND blogs.status = 'published' 
    AND blogs.admin_verified = true
  )
);

CREATE POLICY "Registered members can create comments" 
ON public.blog_comments 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.members 
    WHERE members.user_id = auth.uid() 
    AND members.registration_status = 'approved'
  )
  AND EXISTS (
    SELECT 1 FROM public.blogs 
    WHERE blogs.id = blog_comments.blog_id 
    AND blogs.status = 'published' 
    AND blogs.admin_verified = true
  )
);

CREATE POLICY "Users can manage their own comments" 
ON public.blog_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.blog_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for blogs
CREATE POLICY "Anyone can view published blogs" 
ON public.blogs 
FOR SELECT 
USING (status = 'published' AND admin_verified = true);

CREATE POLICY "Users can view their own blogs" 
ON public.blogs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Registered members can create blogs" 
ON public.blogs 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.members 
    WHERE members.user_id = auth.uid() 
    AND members.registration_status = 'approved'
  )
);

CREATE POLICY "Users can update their own blogs" 
ON public.blogs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blogs" 
ON public.blogs 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all blogs" 
ON public.blogs 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role IN ('super_admin', 'general_admin', 'content_admin')
  )
);

-- Create function to handle blog like points
CREATE OR REPLACE FUNCTION handle_blog_like_points()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Award points for liking a blog
    PERFORM public.award_activity_points(
      NEW.user_id,
      'blog_like',
      NEW.blog_id,
      'Liked a blog post'
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Remove points when unlike (optional - you may want to keep points)
    -- This would require a more complex point system to track and remove specific points
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for blog like points
DROP TRIGGER IF EXISTS blog_like_points_trigger ON public.blog_likes;
CREATE TRIGGER blog_like_points_trigger
  AFTER INSERT OR DELETE ON public.blog_likes
  FOR EACH ROW EXECUTE FUNCTION handle_blog_like_points();

-- Add constraint to prevent duplicate likes (drop first if exists)
ALTER TABLE public.blog_likes 
DROP CONSTRAINT IF EXISTS unique_user_blog_like;

ALTER TABLE public.blog_likes 
ADD CONSTRAINT unique_user_blog_like UNIQUE (user_id, blog_id);

-- Create storage bucket for blog attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-attachments', 'blog-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can view blog attachments" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own blog attachments" ON storage.objects;

-- Create storage policies for blog attachments
CREATE POLICY "Anyone can view blog attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-attachments');

CREATE POLICY "Authenticated users can upload blog attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'blog-attachments' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own blog attachments" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'blog-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
