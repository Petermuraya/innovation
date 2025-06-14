
-- Create enum for election positions
CREATE TYPE public.election_position AS ENUM (
  'chairman',
  'vice_chairman', 
  'treasurer',
  'secretary',
  'vice_secretary',
  'organizing_secretary',
  'auditor'
);

-- Create enum for election status
CREATE TYPE public.election_status AS ENUM (
  'draft',
  'nomination_open',
  'voting_open',
  'completed',
  'cancelled'
);

-- Create elections table
CREATE TABLE public.elections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  nomination_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  nomination_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  voting_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  voting_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status election_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create election positions table (which positions are available in each election)
CREATE TABLE public.election_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  position_type election_position NOT NULL,
  max_candidates INTEGER DEFAULT NULL, -- NULL means unlimited
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(election_id, position_type)
);

-- Create candidates table (members applying for positions)
CREATE TABLE public.election_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  position_type election_position NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  manifesto TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(election_id, position_type, user_id)
);

-- Create votes table
CREATE TABLE public.election_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  election_id UUID NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
  position_type election_position NOT NULL,
  voter_id UUID NOT NULL REFERENCES auth.users(id),
  candidate_id UUID NOT NULL REFERENCES public.election_candidates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(election_id, position_type, voter_id) -- One vote per position per voter
);

-- Enable RLS on all tables
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.election_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for elections
CREATE POLICY "Everyone can view active elections" 
  ON public.elections 
  FOR SELECT 
  USING (status IN ('nomination_open', 'voting_open', 'completed'));

CREATE POLICY "Admins can manage elections" 
  ON public.elections 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for election_positions
CREATE POLICY "Everyone can view election positions" 
  ON public.election_positions 
  FOR SELECT 
  USING (EXISTS(SELECT 1 FROM public.elections WHERE id = election_id AND status IN ('nomination_open', 'voting_open', 'completed')));

CREATE POLICY "Admins can manage election positions" 
  ON public.election_positions 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for election_candidates
CREATE POLICY "Everyone can view approved candidates" 
  ON public.election_candidates 
  FOR SELECT 
  USING (status = 'approved' AND EXISTS(SELECT 1 FROM public.elections WHERE id = election_id AND status IN ('nomination_open', 'voting_open', 'completed')));

CREATE POLICY "Users can apply as candidates" 
  ON public.election_candidates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND EXISTS(SELECT 1 FROM public.elections WHERE id = election_id AND status = 'nomination_open'));

CREATE POLICY "Users can view their own applications" 
  ON public.election_candidates 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage candidates" 
  ON public.election_candidates 
  FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for election_votes
CREATE POLICY "Users can vote during voting period" 
  ON public.election_votes 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = voter_id AND 
    EXISTS(SELECT 1 FROM public.elections WHERE id = election_id AND status = 'voting_open' AND now() BETWEEN voting_start_date AND voting_end_date) AND
    EXISTS(SELECT 1 FROM public.election_candidates WHERE id = candidate_id AND status = 'approved')
  );

CREATE POLICY "Users can view their own votes" 
  ON public.election_votes 
  FOR SELECT 
  USING (auth.uid() = voter_id);

CREATE POLICY "Admins can view all votes" 
  ON public.election_votes 
  FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to get election results
CREATE OR REPLACE FUNCTION public.get_election_results(election_id_param UUID)
RETURNS TABLE(
  position_type election_position,
  candidate_id UUID,
  candidate_name TEXT,
  vote_count BIGINT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    ev.position_type,
    ev.candidate_id,
    m.name as candidate_name,
    COUNT(*) as vote_count
  FROM public.election_votes ev
  JOIN public.election_candidates ec ON ev.candidate_id = ec.id
  JOIN public.members m ON ec.user_id = m.user_id
  WHERE ev.election_id = election_id_param
  GROUP BY ev.position_type, ev.candidate_id, m.name
  ORDER BY ev.position_type, vote_count DESC;
$$;

-- Create function to check if user can vote
CREATE OR REPLACE FUNCTION public.can_user_vote(election_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.elections e
    WHERE e.id = election_id_param
    AND e.status = 'voting_open'
    AND now() BETWEEN e.voting_start_date AND e.voting_end_date
  ) AND EXISTS(
    SELECT 1 FROM public.members m
    WHERE m.user_id = user_id_param
    AND m.registration_status = 'approved'
  );
$$;
