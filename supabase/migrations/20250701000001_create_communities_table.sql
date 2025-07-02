-- Create communities table if it doesn't exist

CREATE TABLE IF NOT EXISTS public.communities (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_memberships table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.community_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id TEXT NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  join_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'member',
  UNIQUE(user_id, community_id)
);

-- Enable RLS on tables
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_memberships ENABLE ROW LEVEL SECURITY;

-- RLS policies for communities (everyone can view active communities)
CREATE POLICY "Everyone can view active communities" 
  ON public.communities 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Admins can manage communities" 
  ON public.communities 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'patron')
    )
  );

-- RLS policies for community_memberships
CREATE POLICY "Users can view their own memberships" 
  ON public.community_memberships 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own memberships" 
  ON public.community_memberships 
  FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all memberships" 
  ON public.community_memberships 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_admin', 'patron')
    )
  );

-- Function to update member count
CREATE OR REPLACE FUNCTION public.update_community_member_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.communities 
    SET member_count = member_count + 1 
    WHERE id = NEW.community_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.communities 
    SET member_count = GREATEST(member_count - 1, 0) 
    WHERE id = OLD.community_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create triggers for member count updates
DROP TRIGGER IF EXISTS community_membership_count_trigger ON public.community_memberships;
CREATE TRIGGER community_membership_count_trigger
  AFTER INSERT OR DELETE ON public.community_memberships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_community_member_count();

-- Insert default communities with updated member counts
INSERT INTO public.communities (id, name, description, icon, color) VALUES
  ('web-dev', 'Web Development', 'Frontend and backend web development community', '🌐', '#3B82F6'),
  ('mobile-dev', 'Mobile Development', 'Mobile app development for iOS and Android', '📱', '#10B981'),
  ('data-science', 'Data Science & AI', 'Data analysis, machine learning, and artificial intelligence', '🤖', '#8B5CF6'),
  ('cybersecurity', 'Cybersecurity', 'Information security and ethical hacking', '🔒', '#EF4444'),
  ('iot', 'Internet of Things (IoT)', 'Connected devices and IoT development', '🔗', '#F59E0B'),
  ('blockchain', 'Blockchain & Crypto', 'Blockchain technology and cryptocurrency', '⛓️', '#06B6D4'),
  ('game-dev', 'Game Development', 'Video game development and design', '🎮', '#EC4899'),
  ('ui-ux', 'UI/UX Design', 'User interface and user experience design', '🎨', '#14B8A6')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  updated_at = now();

-- Update member counts for existing communities
UPDATE public.communities 
SET member_count = (
  SELECT COUNT(*) 
  FROM public.community_memberships cm 
  WHERE cm.community_id = communities.id 
  AND cm.is_active = true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_memberships_user_id ON public.community_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_community_memberships_community_id ON public.community_memberships(community_id);
CREATE INDEX IF NOT EXISTS idx_communities_active ON public.communities(is_active);