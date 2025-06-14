
-- Create table for constitution documents
CREATE TABLE public.constitution_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  version TEXT NOT NULL DEFAULT '1.0',
  is_active BOOLEAN DEFAULT true,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.constitution_documents ENABLE ROW LEVEL SECURITY;

-- Policy for members to view active constitution documents
CREATE POLICY "Members can view active constitution documents" 
  ON public.constitution_documents 
  FOR SELECT 
  TO authenticated
  USING (
    is_active = true 
    AND EXISTS (
      SELECT 1 FROM public.members 
      WHERE user_id = auth.uid() 
      AND registration_status = 'approved'
    )
  );

-- Policy for admins to manage constitution documents
CREATE POLICY "Admins can manage constitution documents" 
  ON public.constitution_documents 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin')
    )
  );

-- Create storage bucket for constitution documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'constitution-documents',
  'constitution-documents',
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Storage policies for constitution documents
CREATE POLICY "Anyone can view constitution documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'constitution-documents');

CREATE POLICY "Admins can upload constitution documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'constitution-documents' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin')
    )
  );

CREATE POLICY "Admins can update constitution documents" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'constitution-documents' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin')
    )
  );

CREATE POLICY "Admins can delete constitution documents" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'constitution-documents' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'general_admin')
    )
  );
