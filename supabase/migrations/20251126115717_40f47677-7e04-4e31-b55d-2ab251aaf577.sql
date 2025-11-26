-- Create feedbacks table for collecting user feedback
CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  message TEXT NOT NULL CHECK (char_length(message) >= 10),
  tags TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert feedback (public form)
CREATE POLICY "Anyone can submit feedback" 
ON public.feedbacks 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view feedback (public display)
CREATE POLICY "Anyone can view feedback" 
ON public.feedbacks 
FOR SELECT 
USING (true);

-- Create index for faster querying by created_at
CREATE INDEX idx_feedbacks_created_at ON public.feedbacks(created_at DESC);

-- Add comment for documentation
COMMENT ON TABLE public.feedbacks IS 'Stores user feedback submissions with ratings, messages, and optional contact info';