
-- Create waitlist table to store form submissions
CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  facility_name TEXT NOT NULL,
  facility_size TEXT,
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on email for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Create an index on created_at for sorting
CREATE INDEX idx_waitlist_created_at ON public.waitlist(created_at DESC);

-- Add Row Level Security (RLS) - making it publicly readable for now since it's a waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into waitlist (for the public form)
CREATE POLICY "Anyone can submit to waitlist" 
  ON public.waitlist 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all waitlist entries (for admin purposes)
CREATE POLICY "Authenticated users can view waitlist" 
  ON public.waitlist 
  FOR SELECT 
  TO authenticated
  USING (true);
