
-- Enable real-time for the tables we need to monitor
ALTER TABLE public.members REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;
ALTER TABLE public.member_points REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_points;

-- Create a function to clean up user data when a user is deleted
CREATE OR REPLACE FUNCTION public.cleanup_user_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from member_points
  DELETE FROM public.member_points WHERE user_id = OLD.user_id;
  
  -- Delete from user_roles
  DELETE FROM public.user_roles WHERE user_id = OLD.user_id;
  
  -- Delete from other related tables
  DELETE FROM public.community_memberships WHERE user_id = OLD.user_id;
  DELETE FROM public.event_attendance WHERE user_id = OLD.user_id;
  DELETE FROM public.project_submissions WHERE user_id = OLD.user_id;
  DELETE FROM public.certificates WHERE user_id = OLD.user_id;
  DELETE FROM public.blogs WHERE user_id = OLD.user_id;
  DELETE FROM public.user_website_visits WHERE user_id = OLD.user_id;
  DELETE FROM public.community_visits WHERE user_id = OLD.user_id;
  
  RETURN OLD;
END;
$$;

-- Create trigger to clean up user data when member is deleted
CREATE TRIGGER cleanup_user_data_trigger
  BEFORE DELETE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_user_data();
