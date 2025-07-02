-- Update enhanced leaderboard view to be more robust and handle missing data

-- Drop and recreate the enhanced leaderboard view with better error handling
DROP VIEW IF EXISTS public.enhanced_member_leaderboard;

CREATE OR REPLACE VIEW public.enhanced_member_leaderboard AS
SELECT 
  m.user_id,
  m.name,
  m.email,
  m.avatar_url,
  m.registration_status,
  COALESCE(total_points.points, 0) as total_points,
  COALESCE(event_points.points, 0) as event_points,
  COALESCE(project_points.points, 0) as project_points,
  COALESCE(blog_points.points, 0) as blog_points,
  COALESCE(visit_points.points, 0) as visit_points,
  COALESCE(subscription_points.points, 0) as subscription_points,
  COALESCE(events_attended.count, 0) as events_attended,
  COALESCE(projects_created.count, 0) as projects_created,
  COALESCE(blogs_written.count, 0) as blogs_written,
  COALESCE(visit_days.count, 0) as visit_days,
  COALESCE(subscriptions.count, 0) as subscriptions_made,
  ROW_NUMBER() OVER (ORDER BY COALESCE(total_points.points, 0) DESC, m.created_at ASC) as rank
FROM public.members m
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  GROUP BY user_id
) total_points ON m.user_id = total_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type = 'event_attendance'
  GROUP BY user_id
) event_points ON m.user_id = event_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type IN ('project_submission', 'project_approval')
  GROUP BY user_id
) project_points ON m.user_id = project_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type IN ('blog_post', 'blog_approval')
  GROUP BY user_id
) blog_points ON m.user_id = blog_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type = 'website_visit'
  GROUP BY user_id
) visit_points ON m.user_id = visit_points.user_id
LEFT JOIN (
  SELECT user_id, SUM(points) as points
  FROM public.member_points
  WHERE activity_type = 'semester_subscription'
  GROUP BY user_id
) subscription_points ON m.user_id = subscription_points.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.member_points
  WHERE activity_type = 'event_attendance'
  GROUP BY user_id
) events_attended ON m.user_id = events_attended.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.project_submissions
  GROUP BY user_id
) projects_created ON m.user_id = projects_created.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.blogs
  WHERE status = 'published'
  GROUP BY user_id
) blogs_written ON m.user_id = blogs_written.user_id
LEFT JOIN (
  SELECT user_id, COUNT(DISTINCT visit_date) as count
  FROM public.user_website_visits
  GROUP BY user_id
) visit_days ON m.user_id = visit_days.user_id
LEFT JOIN (
  SELECT user_id, COUNT(*) as count
  FROM public.member_points
  WHERE activity_type = 'semester_subscription'
  GROUP BY user_id
) subscriptions ON m.user_id = subscriptions.user_id
WHERE m.registration_status = 'approved'
ORDER BY total_points DESC, m.created_at ASC;

-- Grant permissions on the view
GRANT SELECT ON public.enhanced_member_leaderboard TO authenticated;
GRANT SELECT ON public.enhanced_member_leaderboard TO anon;

-- Create a simpler member leaderboard view as backup
CREATE OR REPLACE VIEW public.simple_member_leaderboard AS
SELECT 
  m.user_id,
  m.name,
  m.email,
  m.avatar_url,
  m.registration_status,
  m.created_at,
  ROW_NUMBER() OVER (ORDER BY m.created_at ASC) as rank
FROM public.members m
WHERE m.registration_status = 'approved'
ORDER BY m.created_at ASC;

-- Grant permissions on the simple view
GRANT SELECT ON public.simple_member_leaderboard TO authenticated;
GRANT SELECT ON public.simple_member_leaderboard TO anon;