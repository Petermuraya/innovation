
-- Create table for election advertisements
CREATE TABLE public.election_advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.election_candidates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  display_priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  impressions_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create table for ad impressions tracking
CREATE TABLE public.ad_impressions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advertisement_id UUID NOT NULL REFERENCES public.election_advertisements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT
);

-- Create table for real-time vote tracking
CREATE TABLE public.election_vote_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  position_type election_position NOT NULL,
  total_votes INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(election_id, position_type)
);

-- Enable RLS on advertisement tables
ALTER TABLE public.election_advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_vote_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for election_advertisements
CREATE POLICY "Everyone can view active ads during election period" 
  ON public.election_advertisements 
  FOR SELECT 
  USING (
    is_active = true 
    AND EXISTS(
      SELECT 1 FROM public.elections e 
      WHERE e.id = election_id 
      AND e.status IN ('nomination_open', 'voting_open')
      AND now() BETWEEN e.nomination_start_date AND e.voting_end_date
    )
  );

CREATE POLICY "Candidates can manage their own ads" 
  ON public.election_advertisements 
  FOR ALL 
  USING (
    EXISTS(
      SELECT 1 FROM public.election_candidates ec 
      WHERE ec.id = candidate_id 
      AND ec.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all ads" 
  ON public.election_advertisements 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'general_admin'));

-- RLS Policies for ad_impressions
CREATE POLICY "Users can view their own impressions" 
  ON public.ad_impressions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can record impressions" 
  ON public.ad_impressions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view all impressions" 
  ON public.ad_impressions 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'general_admin'));

-- RLS Policies for vote tracking
CREATE POLICY "Everyone can view vote counts during active elections" 
  ON public.election_vote_tracking 
  FOR SELECT 
  USING (
    EXISTS(
      SELECT 1 FROM public.elections e 
      WHERE e.id = election_id 
      AND e.status = 'voting_open'
    )
  );

CREATE POLICY "System can update vote tracking" 
  ON public.election_vote_tracking 
  FOR ALL 
  USING (true);

-- Function to get random active advertisements
CREATE OR REPLACE FUNCTION public.get_random_election_ads(limit_count INTEGER DEFAULT 3)
RETURNS TABLE(
  id UUID,
  title TEXT,
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  candidate_name TEXT,
  position_type election_position,
  election_title TEXT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    ea.id,
    ea.title,
    ea.content,
    ea.image_url,
    ea.video_url,
    m.name as candidate_name,
    ec.position_type,
    e.title as election_title
  FROM public.election_advertisements ea
  JOIN public.election_candidates ec ON ea.candidate_id = ec.id
  JOIN public.members m ON ec.user_id = m.user_id
  JOIN public.elections e ON ea.election_id = e.id
  WHERE ea.is_active = true
    AND e.status IN ('nomination_open', 'voting_open')
    AND now() BETWEEN e.nomination_start_date AND e.voting_end_date
    AND (ea.expires_at IS NULL OR ea.expires_at > now())
  ORDER BY RANDOM()
  LIMIT limit_count;
$$;

-- Function to track ad impressions
CREATE OR REPLACE FUNCTION public.track_ad_impression(
  ad_id UUID,
  user_id_param UUID DEFAULT NULL,
  ip_address_param INET DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL,
  session_id_param TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert impression record
  INSERT INTO public.ad_impressions (
    advertisement_id,
    user_id,
    ip_address,
    user_agent,
    session_id
  ) VALUES (
    ad_id,
    user_id_param,
    ip_address_param,
    user_agent_param,
    session_id_param
  );
  
  -- Update impressions count
  UPDATE public.election_advertisements
  SET impressions_count = impressions_count + 1,
      updated_at = now()
  WHERE id = ad_id;
END;
$$;

-- Function to update vote tracking when votes are cast
CREATE OR REPLACE FUNCTION public.update_vote_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update or insert vote tracking
  INSERT INTO public.election_vote_tracking (election_id, position_type, total_votes)
  VALUES (NEW.election_id, NEW.position_type, 1)
  ON CONFLICT (election_id, position_type)
  DO UPDATE SET 
    total_votes = election_vote_tracking.total_votes + 1,
    last_updated = now();
  
  RETURN NEW;
END;
$$;

-- Create trigger to update vote tracking
CREATE TRIGGER update_vote_tracking_trigger
  AFTER INSERT ON public.election_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vote_tracking();

-- Enable realtime for vote tracking
ALTER TABLE public.election_vote_tracking REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.election_vote_tracking;

-- Function to get current vote counts for an election
CREATE OR REPLACE FUNCTION public.get_election_vote_counts(election_id_param UUID)
RETURNS TABLE(
  position_type election_position,
  candidate_id UUID,
  candidate_name TEXT,
  vote_count BIGINT,
  total_position_votes BIGINT
)
LANGUAGE SQL
STABLE
AS $$
  WITH vote_counts AS (
    SELECT 
      ev.position_type,
      ev.candidate_id,
      COUNT(*) as vote_count
    FROM public.election_votes ev
    WHERE ev.election_id = election_id_param
    GROUP BY ev.position_type, ev.candidate_id
  ),
  position_totals AS (
    SELECT 
      position_type,
      SUM(vote_count) as total_votes
    FROM vote_counts
    GROUP BY position_type
  )
  SELECT 
    vc.position_type,
    vc.candidate_id,
    m.name as candidate_name,
    vc.vote_count,
    pt.total_votes as total_position_votes
  FROM vote_counts vc
  JOIN public.election_candidates ec ON vc.candidate_id = ec.id
  JOIN public.members m ON ec.user_id = m.user_id
  JOIN position_totals pt ON vc.position_type = pt.position_type
  ORDER BY vc.position_type, vc.vote_count DESC;
$$;
