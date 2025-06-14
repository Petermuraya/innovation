
-- First, add the patron role to the enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'patron';
