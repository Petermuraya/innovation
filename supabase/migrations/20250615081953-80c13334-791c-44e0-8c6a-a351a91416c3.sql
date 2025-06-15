
-- Create audit log table for M-Pesa configuration changes
CREATE TABLE public.mpesa_configuration_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID REFERENCES public.mpesa_configurations(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'activated', 'deactivated'
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  old_values JSONB,
  new_values JSONB,
  change_description TEXT
);

-- Enable RLS on audit table
ALTER TABLE public.mpesa_configuration_audit ENABLE ROW LEVEL SECURITY;

-- Policy for audit table - only super admins can view audit logs
CREATE POLICY "Super admins can view audit logs" 
  ON public.mpesa_configuration_audit 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'super_admin'
    )
  );

-- Add more fields to mpesa_configurations for better management
ALTER TABLE public.mpesa_configurations 
ADD COLUMN IF NOT EXISTS configuration_name TEXT NOT NULL DEFAULT 'Default Configuration',
ADD COLUMN IF NOT EXISTS environment TEXT NOT NULL DEFAULT 'sandbox',
ADD COLUMN IF NOT EXISTS created_by UUID,
ADD COLUMN IF NOT EXISTS is_sandbox BOOLEAN NOT NULL DEFAULT true;

-- Enable RLS on mpesa_configurations
ALTER TABLE public.mpesa_configurations ENABLE ROW LEVEL SECURITY;

-- Policy for viewing configurations - only authorized roles
CREATE POLICY "Authorized users can view configurations" 
  ON public.mpesa_configurations 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'finance_admin', 'chairman', 'vice_chairman')
    )
  );

-- Policy for inserting configurations - only authorized roles
CREATE POLICY "Authorized users can create configurations" 
  ON public.mpesa_configurations 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'finance_admin', 'chairman', 'vice_chairman')
    )
  );

-- Policy for updating configurations - only authorized roles
CREATE POLICY "Authorized users can update configurations" 
  ON public.mpesa_configurations 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'finance_admin', 'chairman', 'vice_chairman')
    )
  );

-- Policy for deleting configurations - only authorized roles
CREATE POLICY "Authorized users can delete configurations" 
  ON public.mpesa_configurations 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('super_admin', 'finance_admin', 'chairman', 'vice_chairman')
    )
  );

-- Function to log configuration changes and notify super admin
CREATE OR REPLACE FUNCTION public.log_mpesa_config_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  action_type TEXT;
  old_vals JSONB;
  new_vals JSONB;
  change_desc TEXT;
  super_admin_id UUID;
  user_name TEXT;
  user_role TEXT;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
    new_vals := to_jsonb(NEW);
    change_desc := 'New M-Pesa configuration created: ' || NEW.configuration_name;
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
    old_vals := to_jsonb(OLD);
    new_vals := to_jsonb(NEW);
    change_desc := 'M-Pesa configuration updated: ' || NEW.configuration_name;
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'deleted';
    old_vals := to_jsonb(OLD);
    change_desc := 'M-Pesa configuration deleted: ' || OLD.configuration_name;
  END IF;

  -- Get user details
  SELECT m.name, ur.role INTO user_name, user_role
  FROM public.members m
  JOIN public.user_roles ur ON m.user_id = ur.user_id
  WHERE m.user_id = auth.uid();

  -- Log the change
  INSERT INTO public.mpesa_configuration_audit (
    configuration_id,
    action,
    changed_by,
    old_values,
    new_values,
    change_description
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    action_type,
    auth.uid(),
    old_vals,
    new_vals,
    change_desc
  );

  -- Notify super admins if the change wasn't made by a super admin
  IF user_role != 'super_admin' THEN
    FOR super_admin_id IN 
      SELECT ur.user_id 
      FROM public.user_roles ur 
      WHERE ur.role = 'super_admin'
    LOOP
      INSERT INTO public.notifications (
        user_id,
        title,
        message,
        type,
        priority,
        metadata
      ) VALUES (
        super_admin_id,
        'M-Pesa Configuration Changed',
        user_name || ' (' || user_role || ') ' || change_desc,
        'alert',
        'high',
        jsonb_build_object(
          'configuration_id', COALESCE(NEW.id, OLD.id),
          'action', action_type,
          'changed_by', auth.uid(),
          'change_description', change_desc
        )
      );
    END LOOP;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS mpesa_config_audit_trigger ON public.mpesa_configurations;
CREATE TRIGGER mpesa_config_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.mpesa_configurations
  FOR EACH ROW EXECUTE FUNCTION public.log_mpesa_config_change();
