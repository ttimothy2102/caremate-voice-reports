
-- First, drop the existing foreign key constraint on assigned_staff
ALTER TABLE public.schedules 
  DROP CONSTRAINT IF EXISTS schedules_assigned_staff_fkey;

-- Add created_by column to track who created each schedule
ALTER TABLE public.schedules 
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id);

-- Update the schedules table to ensure it has all necessary fields and constraints
ALTER TABLE public.schedules 
  ALTER COLUMN assigned_staff TYPE text,
  ALTER COLUMN event_type SET NOT NULL,
  ALTER COLUMN end_time SET NOT NULL;

-- Add a check constraint for valid event types
ALTER TABLE public.schedules 
  ADD CONSTRAINT valid_event_type 
  CHECK (event_type IN ('medical', 'therapy', 'social', 'hygiene', 'meal', 'rest', 'custom'));

-- Add a check constraint for valid recurring patterns
ALTER TABLE public.schedules 
  ADD CONSTRAINT valid_recurring_pattern 
  CHECK (recurring_pattern IN ('none', 'daily', 'weekly', 'monthly'));

-- Enable Row Level Security
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional cleanup)
DROP POLICY IF EXISTS "Authenticated users can view schedules" ON public.schedules;
DROP POLICY IF EXISTS "Authenticated users can create schedules" ON public.schedules;
DROP POLICY IF EXISTS "Authenticated users can update schedules" ON public.schedules;
DROP POLICY IF EXISTS "Authenticated users can delete schedules" ON public.schedules;

-- Create secure RLS policies
CREATE POLICY "Authenticated users can view all schedules"
  ON public.schedules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert schedules"
  ON public.schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Authenticated users can update schedules"
  ON public.schedules
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete schedules"
  ON public.schedules
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_schedules_resident_id ON public.schedules(resident_id);
CREATE INDEX IF NOT EXISTS idx_schedules_start_time ON public.schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_schedules_event_type ON public.schedules(event_type);
CREATE INDEX IF NOT EXISTS idx_schedules_created_by ON public.schedules(created_by);
