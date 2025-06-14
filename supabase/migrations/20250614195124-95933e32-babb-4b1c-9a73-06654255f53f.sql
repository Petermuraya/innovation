
-- Create enum for complaint/recommendation types
CREATE TYPE public.submission_type AS ENUM ('complaint', 'recommendation', 'thought');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('pending', 'in_progress', 'resolved', 'closed');

-- Create enum for admin categories that can receive submissions
CREATE TYPE public.admin_category AS ENUM ('super_admin', 'patron_chairman', 'treasurer', 'organizing_secretary', 'community_admin', 'general_admin');

-- Create table for user submissions (complaints, recommendations, thoughts)
CREATE TABLE public.user_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  submission_type public.submission_type NOT NULL,
  status public.submission_status NOT NULL DEFAULT 'pending',
  directed_to public.admin_category NOT NULL DEFAULT 'general_admin',
  priority INTEGER NOT NULL DEFAULT 1, -- 1=low, 2=medium, 3=high
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Create table for admin responses
CREATE TABLE public.submission_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.user_submissions(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response_content TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT true, -- whether the response is visible to the submitter
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for submission attachments (optional files)
CREATE TABLE public.submission_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.user_submissions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_submissions
-- Users can view their own submissions
CREATE POLICY "Users can view their own submissions" 
  ON public.user_submissions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own submissions
CREATE POLICY "Users can create submissions" 
  ON public.user_submissions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending submissions
CREATE POLICY "Users can update their own pending submissions" 
  ON public.user_submissions 
  FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all submissions based on their role
CREATE POLICY "Admins can view relevant submissions" 
  ON public.user_submissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND (
        ur.role = 'super_admin' OR
        (ur.role = 'chairman' AND directed_to IN ('patron_chairman', 'super_admin')) OR
        (ur.role = 'finance_admin' AND directed_to = 'treasurer') OR
        (ur.role = 'general_admin' AND directed_to IN ('organizing_secretary', 'general_admin')) OR
        (ur.role = 'community_admin' AND directed_to = 'community_admin')
      )
    )
  );

-- Admins can update submission status
CREATE POLICY "Admins can update submission status" 
  ON public.user_submissions 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin', 'chairman', 'finance_admin', 'community_admin')
    )
  );

-- RLS Policies for submission_responses
-- Users can view responses to their submissions
CREATE POLICY "Users can view responses to their submissions" 
  ON public.submission_responses 
  FOR SELECT 
  USING (
    is_public = true AND EXISTS (
      SELECT 1 FROM public.user_submissions us
      WHERE us.id = submission_id AND us.user_id = auth.uid()
    )
  );

-- Admins can view all responses
CREATE POLICY "Admins can view all responses" 
  ON public.submission_responses 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin', 'chairman', 'finance_admin', 'community_admin')
    )
  );

-- Admins can create responses
CREATE POLICY "Admins can create responses" 
  ON public.submission_responses 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = admin_id AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin', 'chairman', 'finance_admin', 'community_admin')
    )
  );

-- Admins can update their own responses
CREATE POLICY "Admins can update their own responses" 
  ON public.submission_responses 
  FOR UPDATE 
  USING (auth.uid() = admin_id);

-- RLS Policies for submission_attachments
-- Users can view attachments for their submissions
CREATE POLICY "Users can view their submission attachments" 
  ON public.submission_attachments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_submissions us
      WHERE us.id = submission_id AND us.user_id = auth.uid()
    )
  );

-- Users can create attachments for their submissions
CREATE POLICY "Users can create submission attachments" 
  ON public.submission_attachments 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = uploaded_by AND EXISTS (
      SELECT 1 FROM public.user_submissions us
      WHERE us.id = submission_id AND us.user_id = auth.uid()
    )
  );

-- Admins can view all attachments
CREATE POLICY "Admins can view all submission attachments" 
  ON public.submission_attachments 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin', 'chairman', 'finance_admin', 'community_admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_user_submissions_user_id ON public.user_submissions(user_id);
CREATE INDEX idx_user_submissions_status ON public.user_submissions(status);
CREATE INDEX idx_user_submissions_directed_to ON public.user_submissions(directed_to);
CREATE INDEX idx_user_submissions_type ON public.user_submissions(submission_type);
CREATE INDEX idx_submission_responses_submission_id ON public.submission_responses(submission_id);
CREATE INDEX idx_submission_attachments_submission_id ON public.submission_attachments(submission_id);

-- Create view for submissions with response counts
CREATE VIEW public.submissions_with_stats AS
SELECT 
  us.*,
  m.name as submitter_name,
  m.email as submitter_email,
  COUNT(sr.id) as response_count,
  MAX(sr.created_at) as last_response_at
FROM public.user_submissions us
LEFT JOIN public.members m ON us.user_id = m.user_id
LEFT JOIN public.submission_responses sr ON us.id = sr.submission_id
GROUP BY us.id, m.name, m.email;
