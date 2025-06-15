
-- Create function to reset leaderboard points for academic year
CREATE OR REPLACE FUNCTION public.reset_leaderboard_for_academic_year(reset_reason text DEFAULT 'Academic year end reset')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  points_reset_count integer;
  visits_reset_count integer;
  admin_user_id uuid := auth.uid();
BEGIN
  -- Check if user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = admin_user_id AND role = 'super_admin'
  ) THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Only super admins can reset the leaderboard'
    );
  END IF;

  -- Reset all member points
  DELETE FROM public.member_points;
  GET DIAGNOSTICS points_reset_count = ROW_COUNT;

  -- Reset website visits
  DELETE FROM public.user_website_visits;
  GET DIAGNOSTICS visits_reset_count = ROW_COUNT;

  -- Reset community visits
  DELETE FROM public.community_visits;

  -- Log the reset action
  INSERT INTO public.member_points (
    user_id,
    points,
    source,
    description,
    activity_type,
    activity_date
  ) VALUES (
    admin_user_id,
    0,
    'admin_action',
    'Leaderboard reset: ' || reset_reason,
    'admin_reset',
    CURRENT_DATE
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Leaderboard reset successfully',
    'points_reset', points_reset_count,
    'visits_reset', visits_reset_count,
    'reset_by', admin_user_id,
    'reset_reason', reset_reason
  );
END;
$$;

-- Grant execute permission to authenticated users (function checks admin role internally)
GRANT EXECUTE ON FUNCTION public.reset_leaderboard_for_academic_year TO authenticated;
