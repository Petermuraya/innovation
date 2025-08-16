
-- Create blog_drafts table for member blog posts
CREATE TABLE IF NOT EXISTS public.blog_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on blog_drafts
ALTER TABLE public.blog_drafts ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_drafts
CREATE POLICY "Users can manage their own blog drafts" ON public.blog_drafts
  FOR ALL USING (auth.uid() = user_id);

-- Create member_notifications table for enhanced notifications
CREATE TABLE IF NOT EXISTS public.member_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'welcome')),
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on member_notifications
ALTER TABLE public.member_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for member_notifications
CREATE POLICY "Users can view their own notifications" ON public.member_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.member_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create welcome notification trigger function
CREATE OR REPLACE FUNCTION public.create_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert welcome notification for new member
  INSERT INTO public.member_notifications (
    user_id,
    title,
    message,
    type,
    metadata
  ) VALUES (
    NEW.user_id,
    'Welcome to KIC!',
    'Welcome to the Kenya Innovation Community! We''re excited to have you join our community of innovators and tech enthusiasts.',
    'welcome',
    jsonb_build_object('is_welcome', true, 'member_id', NEW.id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for welcome notifications on member approval
CREATE OR REPLACE TRIGGER welcome_notification_trigger
  AFTER UPDATE ON public.members
  FOR EACH ROW
  WHEN (OLD.registration_status != 'approved' AND NEW.registration_status = 'approved')
  EXECUTE FUNCTION public.create_welcome_notification();

-- Update community_memberships to track membership details
ALTER TABLE public.community_memberships 
ADD COLUMN IF NOT EXISTS membership_fee_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS membership_expires_at TIMESTAMPTZ;

-- Create function to handle community membership fee tracking
CREATE OR REPLACE FUNCTION public.handle_community_membership_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Update membership payment status when payment is successful
  IF NEW.status = 'completed' AND NEW.payment_type = 'community_membership' THEN
    UPDATE public.community_memberships 
    SET 
      membership_fee_paid = true,
      payment_date = NEW.created_at,
      membership_expires_at = (NEW.created_at + INTERVAL '1 year')
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for community membership payments
CREATE OR REPLACE TRIGGER community_membership_payment_trigger
  AFTER UPDATE ON public.mpesa_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_community_membership_payment();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_drafts_user_id ON public.blog_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_drafts_status ON public.blog_drafts(status);
CREATE INDEX IF NOT EXISTS idx_member_notifications_user_id ON public.member_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_member_notifications_is_read ON public.member_notifications(is_read);
