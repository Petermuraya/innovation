
-- First, add the new enum values in a separate transaction
ALTER TYPE comprehensive_role ADD VALUE IF NOT EXISTS 'chairman';
ALTER TYPE comprehensive_role ADD VALUE IF NOT EXISTS 'vice_chairman';
